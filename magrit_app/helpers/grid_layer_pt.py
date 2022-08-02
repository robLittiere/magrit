# -*- coding: utf-8 -*-
"""
@author: mz
"""
from geopandas import GeoDataFrame, GeoSeries
from shapely.geometry import Polygon
from shapely.ops import unary_union
from shapely import speedups
import numpy as np
import ujson as json
from .geo import (
    repairCoordsPole, TopologicalError,
    multi_to_single, try_open_geojson)
from .grid_helpers import (
    square_grid_gen, diams_grid_gen, hex_grid_gen, to_float, make_index)


def get_func(func):
    if func == 'mean':
        return lambda a: np.mean(a[0])
        # value = np.mean(array_values[idx])
    elif func == 'density':
        return lambda a: (np.sum(a[0]) / a[1]) * 100000
        # value = np.sum(array_values[idx]) / cell.area
    elif func == 'density_count':
        return lambda a: (len(a[0]) / a[1]) * 100000
        # value = np.sum(array_values[idx]) / cell.area
    elif func == 'stddev':
        return lambda a: np.std(a[0])
        # value = np.mean(array_values[idx])
    elif func == 'count':
        return lambda a: len(a[0])
    elif func == 'weighted':
        return lambda a: np.sum(a[0])


def get_grid_layer_pt(input_file, height, field_name,
                      grid_shape="square", mask_layer=None,
                      polygon_layer=None, func='density'):
    if speedups.available and not speedups.enabled:
        speedups.enable()
    proj_robinson = (
            "+proj=robin +lon_0=0 +x_0=0 +y_0=0 "
            "+ellps=WGS84 +datum=WGS84 +units=m +no_defs")

    gdf, replaced_id_field = try_open_geojson(input_file)
    if replaced_id_field and field_name == 'id':
        field_name = '_id'

    if field_name:
        if not gdf[field_name].dtype in (int, float):
            # gdf.loc[:, field_name] = gdf[field_name].replace('', np.NaN)
            # gdf.loc[:, field_name] = gdf[field_name].astype(float)
            gdf.loc[:, field_name] = gdf[field_name].apply(to_float)
        gdf = gdf[gdf[field_name].notnull()]
        gdf = gdf[gdf.geometry.notnull()]
        gdf = gdf[~gdf.geometry.is_empty]
        gdf.index = range(len(gdf))

    if polygon_layer:
        polygon_layer = GeoDataFrame.from_file(
            polygon_layer).to_crs(crs=proj_robinson)
        gdf.to_crs(crs=proj_robinson, inplace=True)
        result_values = get_dens_from_pt(gdf, field_name, polygon_layer, func)
        polygon_layer[func] = [i[0] for i in result_values]
        polygon_layer['count'] = [i[1] for i in result_values]
        return polygon_layer.to_crs("epsg:4326").to_json()

    else:
        if mask_layer:
            _mask = GeoDataFrame.from_file(mask_layer)

            mask = GeoSeries(
                unary_union(_mask.geometry.buffer(0)),
                crs=_mask.crs,
                ).to_crs(crs=proj_robinson).values[0]

            try:
                mask = mask.buffer(1).buffer(-1)
            except TopologicalError:
                mask = mask.buffer(0)
        else:
            mask = None

        gdf.to_crs(crs=proj_robinson, inplace=True)

        cell_generator = {
            "square": square_grid_gen,
            "diamond": diams_grid_gen,
            "hexagon": hex_grid_gen,
            }[grid_shape]

        res_geoms = get_dens_grid_pt(
            gdf, height, field_name, mask, func, cell_generator)
        result = GeoDataFrame(
            index=range(len(res_geoms)),
            data={'id': [i for i in range(len(res_geoms))],
                  func: [i[1] for i in res_geoms],
                  'count': [i[2] for i in res_geoms]},
            geometry=[i[0] for i in res_geoms],
            crs=gdf.crs
            ).to_crs("epsg:4326")

        total_bounds = result.total_bounds
        if total_bounds[0] < -179.9999 or total_bounds[1] < -89.9999 \
                or total_bounds[2] > 179.9999 or total_bounds[3] > 89.9999:
            result = json.loads(result.to_json())
            repairCoordsPole(result)
            return json.dumps(result)
        else:
            return result.to_json()


def get_dens_from_pt(point_layer, field_name, polygon_layer, func):
    f = get_func(func)
    pts_geoms = point_layer.geometry
    index = make_index([g.buffer(0.1).bounds for g in point_layer.geometry])
    idx_intersects = index.intersection
    array_values = point_layer[field_name].values if field_name \
        else np.array([1 for i in range(len(point_layer))])

    res = []
    for geom in polygon_layer.geometry:
        value = None
        count = None
        idx_pts = list(idx_intersects(geom.bounds, objects='raw'))
        if idx_pts:
            t = pts_geoms[idx_pts].intersects(geom)
            idx = t[t == True].index
            value = f((array_values[idx], geom.area))
            count = len(array_values[idx])
        res.append((value, count))
    return res


def get_dens_grid_pt(gdf, height, field_name, mask, func, cell_generator):
    f = get_func(func)
    if mask:
        xmin, ymin, xmax, ymax = mask.bounds
        total_bounds = mask.bounds
    else:
        xmin, ymin, xmax, ymax = gdf.total_bounds
        xmin = xmin - (xmax - xmin) / 8
        xmax = xmax + (xmax - xmin) / 8
        ymin = ymin - (ymax - ymin) / 8
        ymax = ymax + (ymax - ymin) / 8
        total_bounds = (xmin, ymin, xmax, ymax)

    gdf = multi_to_single(gdf)
    geoms = gdf.geometry
    index = make_index([g.buffer(0.1).bounds for g in geoms])
    idx_intersects = index.intersection
    array_values = gdf[field_name].values if field_name \
        else np.array([1 for i in range(len(gdf))])

    res = []
    for rect, _cell in cell_generator(total_bounds, height):
        value = None
        count = None
        cell = mask.intersection(Polygon(_cell)) if mask else Polygon(_cell)
        if not cell:
            continue
        idx_pts = list(idx_intersects(rect, objects='raw'))
        if idx_pts:
            t = geoms[idx_pts].intersects(cell)
            idx = t[t == True].index
            value = f((array_values[idx], cell.area))
            count = len(array_values[idx])
        res.append((cell, value, count))

    return res
