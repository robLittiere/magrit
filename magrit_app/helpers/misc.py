# -*- coding: utf-8 -*-
"""
@author: mz
"""
import os
import re
from distutils.spawn import find_executable
from io import BytesIO
from random import choice
from zipfile import ZipFile, ZIP_DEFLATED
from ujson import dumps as json_dumps
from os.path import join as path_join, abspath


LIST_CHAR = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100,
             101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
             113, 114, 115, 116, 117, 118, 119, 120, 121, 122]


reg_a = re.compile("[àáâãäæ]")
reg_i = re.compile("[ïîì]")
reg_e = re.compile("[êëéè]")
reg_o = re.compile("[òóôö]")
reg_u = re.compile("[ûüù]")
reg_A = re.compile("[ÀÁÂÃÄ]")
reg_I = re.compile("[ÏÎÌ]")
reg_E = re.compile("[ÊËÉÈ]")
reg_O = re.compile("[ÒÓÔÖ]")
reg_U = re.compile("[ÛÜÙ]")


def run_calc(val1, val2, operator):
    result = {
        "+": val1.__add__, "-": val1.__sub__,
        "*": val1.__mul__, "/": val1.__truediv__,
        "^": val1.__pow__
    }[operator](val2).tolist()
    return json_dumps(result)


def find_geo2topo():
    path = find_executable('geo2topo')
    if not path:
        import glob
        rel_path = glob.glob('**/geo2topo')
        if rel_path:
            path = abspath(rel_path[0])
    return path


def savefile(path, raw_data):
    """
    Write some raw content (`raw_data`, given as bytes) using the given `path`.

    Parameters
    ----------
    path: str
        Path of file to be created.

    raw_data: bytes
        Content of the file to be created.
    """
    with open(path, 'wb') as f:
        f.write(raw_data)


def get_key(var):
    """Find and return an available key (ie. which is not in 'var')."""
    while True:
        k = ''.join([chr(choice(LIST_CHAR))
                     for i in range(25)])
        if k not in var:
            return k


def clean_name(name):
    name = reg_i.sub(
        'i', reg_a.sub('a', reg_u.sub('u', reg_o.sub('o', reg_e.sub('e', name)
                                                     ))))
    name = reg_I.sub(
        'I', reg_A.sub('A', reg_U.sub('U', reg_O.sub('O', reg_E.sub('E', name)
                                                     ))))
    return re.sub(
        '[^a-z.A-Z0-9_-]+', '_', name.replace('ñ', 'n').replace('Ñ', 'N'))


def guess_separator(file, raw_data=None):
    """
    Ugly helper function to return the (guessed) separator of a csv file.

    Parameters
    ----------
    file: str
        Path to file to use.

    raw_data: str
        Csv file as string (optional, to be used if the csv file is already in
        memory; so it won't use the 'file' parameters if raw_data isn't empty).

    Returns
    -------
    sep: str or None
        The guessed separator or None.
    """
    if file:
        with open(file, 'r') as f:
            line = f.readline()
            line2 = f.readline()
    elif raw_data:
        raw_data = raw_data.split('\r\n' if '\r\n' in raw_data else '\n')
        line = raw_data[0]
        line2 = raw_data[1]
    else:
        return None
    c_comma1 = line.count(',')
    c_smcol1 = line.count(';')
    if '\t' in line and not (c_comma1 or c_smcol1):
        return '\t'
    elif c_comma1 and not c_smcol1:
        return ','
    elif c_smcol1 and not c_comma1:
        return ';'
    else:
        c_comma2 = line2.count(',')
        c_smcol2 = line2.count(';')
        if c_comma2 == c_comma1:
            if c_smcol1 != c_smcol2:
                return ','
            else:
                return None
        elif c_smcol2 == c_smcol1:
            if c_comma2 != c_comma1:
                return ';'
            else:
                return None


def extractShpZip(myzip, slots, directory):
    """
    Extract in "directory" the members of "myzip" which are listed in "slots".

    Replace any extension in uppercase by its lowercase counterpart and updated
    the "slots" dictionary according to hold the real path of the extracted
    files.

    Parameters
    ----------
    myzip: zipfile.ZipFile
        The opened ZipFile object containing the members of the Shapefile to
        be extracted.

    slots: dict
        A mapping containing the reference extensions of the file to extract
        and their real name in the archive.

    directory: str
        The temporary directory in which extract the files.

    Returns
    -------
    slots: dict
        A mapping containing the reference extensions and the real path of the
        extracted files.
    """
    for ext, member in slots.items():
        rv = myzip.extract(member, path=directory)
        if ext not in rv:
            os.rename(rv, rv.replace(ext.upper(), ext))
            slots[ext] = rv.replace(ext.upper(), ext)
        else:
            slots[ext] = rv
    return slots


def zip_layer_folder(dir_path, layer_name):
    """
    Create a zip archive with the content of the folder located at `dir_path`
    and name it with `layer_name`.

    Parameters
    ----------
    dir_path: str
        The path to the temporary folder in which are located the files to
        be zipped.

    layer_name: str
        The name of the concerned layer (will be used as file name for the
        zip archive).

    Returns
    -------
    raw_content: str
        The zip archive
    archive_name: str
        The name of the archive (used later in the header of the response).
    """
    filenames = os.listdir(dir_path)
    zip_stream = BytesIO()
    myZip = ZipFile(zip_stream, "w", compression=ZIP_DEFLATED)
    for filename in filenames:
        if not filename.endswith('.geojson'):
            f_name = path_join(dir_path, filename)
            myZip.write(f_name, filename, ZIP_DEFLATED)
    myZip.close()
    zip_stream.seek(0)
    return zip_stream.read(), ''.join([layer_name, ".zip"])
