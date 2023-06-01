# -*- coding: utf-8 -*-
"""
@author: mthh
"""
import rtree
import numpy as np
from math import ceil


def idx_generator_func(bounds):
    for i, bound in enumerate(bounds):
        yield (i, bound, i)


def make_index(bounds):
    return rtree.index.Index([z for z in idx_generator_func(bounds)],
                             Interleaved=True)


def to_float(v):
    try:
        return float(v)
    except:
        return np.NaN


def hex_grid_gen(total_bounds, height):
    xmin, ymin, xmax, ymax = total_bounds
    rows = ceil((ymax-ymin) / height) + 1
    cols = ceil((xmax-xmin) / height)

    x_left_origin = xmin - height
    y_bottom_origin = ymin - height

    half_height = (height / 2)
    xvertexlo = 0.288675134594813 * height
    xvertexhi = 0.577350269189626 * height
    xspacing = xvertexlo + xvertexhi

    for col in range(ceil(cols * 1.5) + 1):
        x1 = x_left_origin + (col * xspacing)  # far left
        x2 = x1 + (xvertexhi - xvertexlo)  # left
        x3 = x_left_origin + ((col + 1) * xspacing)  # right
        x4 = x3 + (xvertexhi - xvertexlo)  # far right
        t = col % 2
        for row in range(rows + 1):
            y1 = y_bottom_origin + (((row * 2) + t) * half_height)  # hi
            y2 = y_bottom_origin + (((row * 2) + t + 1) * half_height)  # mid
            y3 = y_bottom_origin + (((row * 2) + t + 2) * half_height)  # lo

            yield (
                (x1, y1, x4, y3),
                [(x1, y2), (x2, y1), (x3, y1),
                 (x4, y2), (x3, y3), (x2, y3), (x1, y2)])
            # rect = (x1, y1, x4, y3)
            # cell = [
            #     (x1, y2), (x2, y1), (x3, y1),
            #     (x4, y2), (x3, y3), (x2, y3), (x1, y2)]
            # yield (rect, cell)


def diams_grid_gen(total_bounds, height):
    xmin, ymin, xmax, ymax = total_bounds
    height = height * 1.45
    half_height = (height / 2)
    rows = ceil((ymax-ymin) / height) + 1
    cols = ceil((xmax-xmin) / height) + 2

    x_left_origin = xmin - height
    y_bottom_origin = ymin - height

    for col in range((cols * 2) - 1):
        t = col % 2
        x1 = x_left_origin + ((col + 0) * half_height)
        x2 = x_left_origin + ((col + 1) * half_height)
        x3 = x_left_origin + ((col + 2) * half_height)
        for row in range(rows):
            y1 = y_bottom_origin + (((row * 2) + t) * half_height)
            y2 = y_bottom_origin + (((row * 2) + t + 1) * half_height)
            y3 = y_bottom_origin + (((row * 2) + t + 2) * half_height)
            # yield (rect, cell)
            yield (
                (x1, y1, x3, y3),
                [(x1,  y2), (x2,  y1),
                 (x3,  y2), (x2,  y3), (x1,  y2)])


def square_grid_gen(total_bounds, height):
    xmin, ymin, xmax, ymax = total_bounds
    rows = ceil((ymax-ymin) / height)
    cols = ceil((xmax-xmin) / height)

    x_left_origin = xmin
    x_right_origin = xmin + height
    y_top_origin = ymax
    y_bottom_origin = ymax - height

    for countcols in range(cols):
        y_top = y_top_origin
        y_bottom = y_bottom_origin
        for countrows in range(rows):
            # yield (rect, cell)
            yield (
                (x_left_origin, y_bottom, x_right_origin, y_top),
                [(x_left_origin, y_top), (x_right_origin, y_top),
                 (x_right_origin, y_bottom), (x_left_origin, y_bottom)])
            y_top = y_top - height
            y_bottom = y_bottom - height
        x_left_origin = x_left_origin + height
        x_right_origin = x_right_origin + height
