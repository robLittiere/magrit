# All-in-one image to build and execute magrit in a single container.
# See the other recipes (with docker compose) if you want to use magrit with nginx.
# Building this image :
#   docker build -t "magrit" .
# Running this image :
#   docker run --publish "9999:9999" -it "magrit:latest"
FROM ubuntu:22.04
MAINTAINER Matthieu Viry <matthieu.viry@cnrs.fr>

ENV DEBIAN_FRONTEND='noninteractive' TZ='Europe/Paris'

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        software-properties-common gcc g++ libpython3.11-dev python3.11 python3.11-dev python3-pip \
        libgeos-c1v5 libgeos-dev libgdal30 libgdal-dev libspatialindex-dev libffi-dev \
        nodejs npm redis-server libuv1 libuv1-dev unzip wget git \
        libxslt1.1 libxslt1-dev libxml2 libxml2-dev libkml-dev locales \
    && npm -g install topojson \
    && rm -rf /var/lib/apt/lists/* \
    && sed -e '/save/ s/^#*/#/' -i /etc/redis/redis.conf \
    && locale-gen fr_FR.UTF-8

ENV LANG='fr_FR.UTF-8' LANGUAGE='fr_FR' LC_ALL='fr_FR.UTF-8' NODE_ENV='PRODUCTION'

WORKDIR /home

RUN mkdir /home/app && cd /home/app && wget https://github.com/riatelab/magrit/archive/master.zip && unzip master.zip && mv magrit-master magrit

RUN cd /home/app/magrit/ \
    && python3.11 -m pip install --no-cache-dir -U setuptools numpy==1.23.4 \
    && python3.11 -m pip install --no-cache-dir -U -r requirements/prod.txt \
    && python3.11 setup.py build_ext --inplace \
    && cd client \
    && npm install \
    && node node_modules/webpack/bin/webpack.js \
    && cd ../documentation \
    && ./mdbook build

EXPOSE 9999

CMD redis-server \
    & gunicorn "magrit_app.app:create_app()" --bind 0.0.0.0:9999 --worker-class aiohttp.worker.GunicornUVLoopWebWorker --workers 1 --chdir /home/app/magrit/
