# -*- coding: utf-8 -*-
from cpython cimport array
from random import choice

cpdef get_name(unsigned int length=25):
    """
    Find a temporary random name to share object
    with some external soft used (ogr2ogr / topojson / etc.).
    Aimed to be replaced by something better.
    """
    cdef:
        array.array arr = array.array('u', [u'0']* length)
        unsigned int i = 0
        list choice_list = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68,
                   69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
                   83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
                   103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
                   115, 116, 117, 118, 119, 120, 121, 122]

    for i in range(length):
        arr[i] = chr(choice(choice_list))
    return arr.tounicode()

cpdef join_field_topojson(dict topojson, list new_field, str new_field_name):
    cdef:
        unsigned int ix = 0
        dict geom
        str layer_name = list(topojson['objects'].keys())[0]

    for ix, geom in enumerate(topojson['objects'][layer_name]['geometries']):
        try:
            geom['properties'][new_field_name] = new_field[ix]
        except KeyError:
            geom['properties'] = {new_field_name: new_field[ix]}

#cdef list get_comm(list arc_a, list arc_b):
#    cdef:
#        list comm = []
#        int aa, bb
#    for aa in flatten_arc(arc_a):
#        for bb in flatten_arc(arc_b):
#            if aa < 0:
#                aa = ~aa
#            if bb < 0:
#                bb = ~bb
#            if aa == bb:
#                comm.append(aa)
#    return comm
#
#cdef list flatten_arc(list arcs):
#    cdef list res = []
#    for aa in arcs:
#        if isinstance(aa, list):
#            res.extend(aa)
#        else:
#            res.append(aa)
#    return res
#
#cdef dict get_common_arcs(dict topojson):
#    cdef:
#        dict geom_a, geom_b, common_borders = {}
#        str layer_name = list(topojson['objects'].keys())[0]
#        list geoms = topojson['objects'][layer_name]['geometries']
#        list arcs_ref = topojson['arcs']
#        set seen = set()
#        str _id_arcs, _id_arcs_reverse
#
#    for geom_a in geoms:
#        for geom_b in geoms:
#            if geom_a["id"] != geom_b["id"]:
#                common_arcs = get_comm(geom_a["arcs"][0], geom_b["arcs"][0])
#                if common_arcs:
#                    _id_arcs = "_".join([str(geom_a["id"]), str(geom_b["id"])])
#                    _id_arcs_reverse = "_".join([str(geom_b["id"]), str(geom_a["id"])])
#                    if not _id_arcs in seen and not _id_arcs_reverse in seen :
#                        seen.add(_id_arcs)
#                        common_borders[_id_arcs] = [arcs_ref[j] for j in common_arcs]
#    return common_borders
#
#cpdef get_borders_to_geojson(dict topojson):
#    cdef:
#        list res_features = []
#        str feature_st = '''{"type":"Feature","geometry":{"type": "MultiLineString","coordinates":'''
#        str feature_middle = '''},"properties":{"id":"'''
#        str feature_end = '''"}}'''
#        dict common_borders = get_common_arcs(topojson)
#
#    for _id, geom in common_borders.items():
#        res_features.append("".join([feature_st, str(geom), feature_middle, str(_id), feature_end]))
#    return "".join([
#            '''{"type":"FeatureCollection","features":[''',
#            ','.join(res_features),
#            ''']}'''
#            ])
