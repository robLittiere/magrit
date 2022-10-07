#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: mthh
"""
import pytest
import ujson as json
import logging

from magrit_app.app import rawcsv_to_geo, _init
from magrit_app.helpers.topo_to_geo import convert_from_topo
from magrit_app.helpers.geo import check_projection
#from aiohttp import FormData
#from aiohttp.test_utils import make_mocked_request


@pytest.fixture
def read_topo():
    with open("magrit_app/static/data_sample/simplified_land_polygons.topojson", "r") as f:
        data = json.loads(f.read())
    return data

@pytest.fixture
def read_verif_topo():
    with open("tests/sample_result.topojson", "r") as f:
        verif = json.loads(f.read())
    return verif

@pytest.fixture
def read_csv():
    with open("tests/test_xy.csv", "r") as f:
        data_csv = f.read()
    return data_csv

@pytest.fixture
def cli(event_loop, aiohttp_client):
    app = event_loop.run_until_complete(_init(event_loop))
    app.on_shutdown.pop()
    return event_loop.run_until_complete(aiohttp_client(app))

@pytest.mark.asyncio
async def test_convert_csv_to_geo(read_csv):
    logger = logging.getLogger()
    res = await rawcsv_to_geo(read_csv, logger)
    assert "FeatureCollection" in res

# FIXME: precision errors are making this test fail...
# def test_convert_from_topo(read_topo, read_verif_topo):
#     assert json.loads(json.dumps(convert_from_topo(read_topo))) \
#             == read_verif_topo

def test_check_proj4_string():
    assert check_projection("foobar") is False
    assert check_projection("epsg:3035") == {'type': 'epsg', 'value': 3035}
    assert check_projection("epsg:12345") is False

@pytest.mark.asyncio
async def test_calc_helper_float(cli):
    data = {
        "var1": "[1.32,2.36,3.36,4.78,5.45,6.98]",
        "var2": "[6.1,5.2,4.3,3.4,2.5,1.6]",
        "operator": "/"
        }
    resp = await cli.post('/helpers/calc', data=data)
    assert resp.status == 200
    assert await resp.text() \
        == '[0.21639344262295085,0.4538461538461538,0.7813953488372093,1.4058823529411766,2.18,4.3625]'

@pytest.mark.asyncio
async def test_calc_helper_int(cli):
    data = {
       "var1": "[1, 2, 3, 4, 5, 6]",
       "var2": "[6, 5, 4, 3, 2, 1]",
       "operator": "+"
    }
    resp = await cli.post('/helpers/calc', data=data)
    assert resp.status == 200
    assert await resp.text() == '[7,7,7,7,7,7]'

    data = {
       "var1": "[1, 2, 3, 4, 5, 6]",
       "var2": "[6, 5, 4, 3, 2, 1]",
       "operator": "^"
    }
    resp = await cli.post('/helpers/calc', data=data)
    assert resp.status == 200
    assert await resp.text() == '[1,32,81,64,25,6]'

@pytest.mark.asyncio
async def test_get_pages(cli):
    resp = await cli.get('/')
    assert resp.status == 200
    content = await resp.text()
    assert "Magrit" in content

    resp = await cli.get('/modules')
    assert resp.status == 200
    content = await resp.text()
    assert '<html>' in content

    resp = await cli.get('/contact')
    assert resp.status == 200
    content = await resp.text()
    assert "<title>Magrit - Contact</title>" in content

    resp = await cli.get('/abcde')
    assert resp.status == 200
    content = await resp.text()
    assert "<title>Magrit - 404</title>" in content

# async def test_convert_tabular(cli):
#     data = FormData()
#     data.add_field('action', 'submit_form')
#     data.add_field('file[]',
#                    open('../magrit_app/static/data_sample/martinique_data.xlsx', 'rb'),
#                    filename='martinique_data.xlsx',
#                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
#     resp = await cli.post('/convert_tabular', data=data)
#     resp = json.loads(resp)
#     assert resp["name"] == "martinique_data"
#     assert resp["message"] == None
