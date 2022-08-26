# -*- coding: utf-8 -*-
#cython: language_level = 3
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
