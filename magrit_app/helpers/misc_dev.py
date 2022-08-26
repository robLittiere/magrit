#!/usr/bin/env python3.6
# -*- coding: utf-8 -*-
"""
Helpers to spot unused translation keys.

@author: mthh
"""
import ujson as json
import os


def run():
    # To be run in the current folder to use these paths:
    trad_file = '../static/locales/fr/translation.json'
    paths = [
        '../static/js/' + i for i in os.listdir('../static/js') if 'js' in i] \
        + [
        '../templates/' + i for i in os.listdir('../templates') if 'html' in i]

    list_keys = make_list_translate_key(trad_file)
    unused_keys = scan_folder_code(paths, list_keys)

    return unused_keys


def make_list_translate_key(json_file_path, avoid_plural=True):
    """
    Args:
        json_file_path: str,
            The path to a json translation file (as those used in i18next)
        avoid_plural: bool, default True,
            Don't list key with "plural" in their name
            (as they typically aren't called explicitly in the code)

    Return:
        list_key: list of strings,
            The 'reconstituted' translation keys
            (i.e. with their full path like "main_page.foobar_box.title")
    """
    def traverse(elem, path=""):
        for k, v in elem.items():
            if isinstance(v, dict):
                traverse(v, ".".join([path, k]))
            else:
                if "plural" not in k:
                    result_list.append(".".join([path, k]))

    result_list = []
    with open(json_file_path, "r") as f:
        data = json.loads(f.read())

    traverse(data)
    return [i[1:] for i in result_list]


def scan_folder_code(paths, list_key):
    """
    Args:
        paths: array-like,
            An array of path of source code files(html, js, etc.).
        list_key: array-like,
            The array of key extracted from a translation file.

    Return:
        unused_key: list,
            A list of unused key (ie key(s) from `list_key`
            which aren't in any file from `paths`)
    """
    for file_path in paths:
        with open(file_path, 'r') as f:
            content = f.read()
        # Use a copy of the current list to not remove on itself directly:
        for key in list(list_key):
            if key in content:
                list_key.remove(key)
    return list_key


if __name__ == "__main__":
    import pprint
    pprint.pprint(run())
