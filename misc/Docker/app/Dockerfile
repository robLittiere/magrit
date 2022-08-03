####################################################################
# Working config file building an "all-in one" (and heavy)
# image of the app and making it accessible on port 9999
# (but it should be splited in multiple containers).
# Configured in order to avoid using cache when fetching the code of the
# application.
####################################################################
# Can be build like this (if we assume that the magrit code is in /home/$USER/code/magrit)
#
# $ cd /tmp && mkdir magritapp
# $ cp -r /home/$USER/code/magrit/misc/Docker/ magritapp/ && cp -r /home/$USER/code/magrit/magrit_app/static/ magritapp/Docker/nginx/ && cp -r /home/$USER/code/magrit magritapp/Docker/app/
# $ cd magritapp/Docker/app/
# $ docker build -t "magrit_app:latest" --build-arg CACHEBUST=$(date +%s) .
#
#
# App can be started like this (exposing port 9999 in the host):
#
# $ docker run --publish "9999:9999" -it "magrit_app:latest"
#
#
# Access to a shell in the container can be obtained with a command like :
#
# $ docker run -it --entrypoint=/bin/bash "magrit_app:latest"
#
FROM ubuntu:22.04
MAINTAINER Matthieu Viry <matthieu.viry@univ-grenoble-alpes.fr>

ENV DEBIAN_FRONTEND='noninteractive' TZ='Europe/Paris'

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        software-properties-common gcc g++ libpython3.10-dev python3.10 python3.10-dev python3-pip \
        libgeos-c1v5 libgeos-dev libgdal30 libgdal-dev libspatialindex-dev libffi-dev \
        nodejs npm redis-server libuv1 libuv1-dev unzip wget git \
        libxslt1.1 libxslt1-dev libxml2 libxml2-dev libkml-dev locales \
    && npm -g install topojson \
    && rm -rf /var/lib/apt/lists/* \
    && locale-gen fr_FR.UTF-8

ENV LANG='fr_FR.UTF-8' LANGUAGE='fr_FR' LC_ALL='fr_FR.UTF-8' NODE_ENV='PRODUCTION'

WORKDIR /home

ARG CACHEBUST=1

RUN mkdir /home/app && cd /home/app && mkdir magrit
COPY magrit /home/app/magrit
COPY redis.conf /etc/redis/redis.conf

RUN cd /home/app/magrit/ \
    && pip3.10 install -U setuptools numpy==1.23.1 \
    && pip3.10 install -U -r requirements/prod.txt \
    && python3.10 setup.py build_ext --inplace \
    && cd client \
    && npm install \
    && node node_modules/webpack/bin/webpack.js \
    && cd ../documentation \
    && ./mdbook build

EXPOSE 9999

CMD redis-server /etc/redis/redis.conf \
    & gunicorn "magrit_app.app:create_app()" --bind 0.0.0.0:9999 --worker-class aiohttp.worker.GunicornUVLoopWebWorker --max-requests 450 --max-requests-jitter 50 --workers 3 --chdir /home/app/magrit/
