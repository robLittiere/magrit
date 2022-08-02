# -*- coding: utf-8 -*-
"""
@author: mz
"""
from geopandas import GeoDataFrame, GeoSeries
from shapely.geometry import Polygon
from shapely.ops import unary_union
from shapely import speedups
import ujson as json
from .geo import (
    repairCoordsPole, TopologicalError,
    multi_to_single, try_open_geojson)
from .grid_helpers import (
    square_grid_gen, diams_grid_gen, hex_grid_gen, to_float, make_index)


def get_grid_layer(input_file, height, field_name, grid_shape="square"):
    if speedups.available and not speedups.enabled:
        speedups.enable()
    proj_robinson = (
        "+proj=robin +lon_0=0 +x_0=0 +y_0=0 "
        "+ellps=WGS84 +datum=WGS84 +units=m +no_defs")
    gdf, replaced_id_field = try_open_geojson(input_file)
    if replaced_id_field and field_name == 'id':
        field_name = '_id'
    if not gdf[field_name].dtype in (int, float):
        # gdf.loc[:, field_name] = gdf[field_name].replace('', np.NaN)
        # gdf.loc[:, field_name] = gdf[field_name].astype(float)
        gdf.loc[:, field_name] = gdf[field_name].apply(to_float)
    gdf = gdf[gdf[field_name].notnull()]
    gdf = gdf[gdf.geometry.notnull()]
    gdf.index = range(len(gdf))
    gdf.geometry = gdf.geometry.buffer(0)
    mask = GeoSeries(
        unary_union(gdf.geometry),
        crs=gdf.crs
    ).to_crs(crs=proj_robinson).values[0]

    try:
        mask = mask.buffer(1).buffer(-1)
    except TopologicalError:
        mask = mask.buffer(0)

    gdf.to_crs(crs=proj_robinson, inplace=True)

    cell_generator = {
        "square": square_grid_gen,
        "diamond": diams_grid_gen,
        "hexagon": hex_grid_gen,
    }[grid_shape]

    res_geoms = get_dens_grid2(gdf, height, field_name, mask, cell_generator)

    n_field_name = "".join([field_name, "_densitykm"])
    grid = GeoDataFrame(
        index=range(len(res_geoms)),
        data={'id': [i for i in range(len(res_geoms))],
              n_field_name: [i[1] * 1000000 for i in res_geoms],
              'total': [i[2] for i in res_geoms]},
        geometry=[i[0] for i in res_geoms],
        crs=gdf.crs
    ).to_crs("epsg:4326")

    total_bounds = grid.total_bounds
    if total_bounds[0] < -179.9999 or total_bounds[1] < -89.9999 \
            or total_bounds[2] > 179.9999 or total_bounds[3] > 89.9999:
        result = json.loads(grid.to_json())
        repairCoordsPole(result)
        return json.dumps(result)
    else:
        return grid.to_json()


def get_dens_grid2(gdf, height, field_name, mask, cell_generator):
    gdf['area_values'] = gdf.geometry.area
    gdf = multi_to_single(gdf)
    geoms = gdf.geometry
    area_values = gdf['area_values'].values
    index = make_index([g.bounds for g in geoms])
    idx_intersects = index.intersection
    array_values = gdf[field_name].values
    res = []
    for rect, cell in cell_generator(gdf.total_bounds, height):
        idx_poly = list(idx_intersects(rect, objects='raw'))
        if idx_poly:
            p = mask.intersection(Polygon(cell))
            if p:
                t = geoms[idx_poly].intersects(p)
                idx = t[t == True].index
                areas_part = geoms[idx].intersection(p).area.values / area_values[idx]
                _sum = (array_values[idx] * areas_part).sum()
                density = _sum / p.area
                res.append((p, density, _sum))
    return res
