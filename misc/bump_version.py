#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys
from subprocess import Popen, PIPE


def get_version():
    with open('__init__.py', 'r') as f:
        ver = f.read()
    ix = ver.find("'")
    return ver[ix+1:ix + ver[ix+1:].find("'")+1]


def save_version(version):
    with open('__init__.py', 'w') as f:
        f.write("# -*- coding: utf-8 -*-\n\n__version__ = '{}'\n"
                .format(version))


def save_version_packagejson(version):
    with open('package.json') as f:
        data = json.loads(f.read())
    data['version'] = version
    with open('package.json', 'w') as f:
        f.write(json.dumps(data, indent=2))


def rebuild_assets():
    p = Popen(
        'NODE_ENV=production NODE_OPTIONS=--openssl-legacy-provider ./node_modules/webpack/bin/webpack.js',
        shell=True, stderr=PIPE, stdout=PIPE)
    a, b = p.communicate()
    if b:
        print(b)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    os.chdir('../magrit_app')
    old_version = get_version()
    current_version = list(map(int, old_version.split('.')))
    if len(sys.argv) < 2 or sys.argv[1] not in ('patch', 'minor', 'major'):
        sys.exit(-1)

    if 'patch' in sys.argv[1]:
        current_version[2] += 1
    elif 'minor' in sys.argv[1]:
        current_version[2] = 0
        current_version[1] += 1
    elif 'major' in sys.argv[1]:
        current_version[2] = 0
        current_version[1] = 0
        current_version[0] += 1
    current_version_txt = '.'.join(map(str, current_version))
    print('Magrit\n', old_version, ' -> ', current_version_txt, '\n')
    print('- Replacing version number in __init__.py ...')
    save_version(current_version_txt)
    os.chdir('../client')
    print('- Replacing version number in package.json ...')
    save_version_packagejson(current_version_txt)
    if os.path.exists('node_modules/webpack/bin/webpack.js'):
        print('- Building minified JS/CSS files ...')
        rebuild_assets()
    print('\nDone! ', old_version, ' -> ', current_version_txt)
