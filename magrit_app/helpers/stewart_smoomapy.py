# -*- coding: utf-8 -*-
import tempfile
import ujson as json
from os.path import join as path_join
from smoomacypy import SmoothStewart
from geopandas import GeoDataFrame
from .geo import repairCoordsPole


def quick_stewart_mod(input_geojson_points, variable_name, span,
                      beta=2, typefct='exponential',
                      nb_class=None, disc_kind=None, resolution=None,
                      mask=None, variable_name2=None,
                      user_defined_breaks=None):
    """
    Compute a smoothed map (modified function from smoomapy).

    Parameters
    ----------
    input_geojson_points: str
        Path to file to use as input (Points/Polygons), must contain
        a relevant numerical field.
    variable_name: str
        The name of the variable to use (numerical field only).
    span: int
        The span!
    beta: float
        The beta!
    typefct: str, default "exponential"
        The type of function in {"exponential", "pareto"}
    nb_class: int, default None
        The number of class, if unset will most likely be 8.
    resolution: int, default None
        The resolution to use (in unit of the input file), if not set a
        resolution will be used in order to make a grid containing around
        12000 pts.
    mask: str, default None
        Path to the file (Polygons only) to use as clipping mask.
    user_defined_breaks: list or tuple, default None
        A list of ordered break to use to construct the contours
        (override `nb_class` value if any)

    Returns
    -------
    smoothed_geojson: bytes
        The result dumped as GeoJSON (utf-8 encoded).
    breaks: dict
        The break values used.
    """
    StePot = SmoothStewart(
        input_geojson_points, variable_name,
        span, beta, typefct, resolution=resolution,
        variable_name2=variable_name2, mask=mask, distGeo=False,
        projDistance='+proj=natearth')
    result = StePot.render(nb_class,
                           disc_kind,
                           user_defined_breaks,
                           output="GeoDataFrame")
    _min, _max = result[["min", "max"]].values.T.tolist()
    result.to_crs('epsg:4326', inplace=True)
    if not mask:
        # In some weird cases, when not using a clipping mask, some resulting
        # geometries seems to be malformed, but hopefully saving it
        # to shapefile then reopening it seems to fix that:
        res = save_reload(result)
    else:
        res = json.loads(result[::-1].to_json())
    repairCoordsPole(res)
    return (
        json.dumps(res).encode(),
        {"min": _min[::-1], "max": _max[::-1]})


def save_reload(result_layer):
    """
    Save the 'result_layer' geodataframe as a Shapefile and reload it.

    Save the 'result_layer' geodataframe as a Shapefile (with the hope of
    taking advantage of the reparation of some geometries offered by one of the
    intermediate libraries used for saving it), then reload it and return it
    as a GeoJSON FeatureCollection, loaded in a python 'dict'.

    Parameters
    ----------
    result_layer: GeoDataFrame
        The GeoDataFrame containing the contour computed
        from smoomapy functionality.

    Returns
    -------
    result_layer: dict
        The same layer with, hopefully, some geometry error fixed. The layer is
        returned loaded as a 'dict', using GeoJSON schema.
    """
    with tempfile.TemporaryDirectory() as tmpdirname:
        fpath = path_join(tmpdirname, 'result.shp')
        result_layer.to_file(fpath)
        gdf = GeoDataFrame.from_file(fpath)
        return json.loads(gdf[::-1].to_json())
