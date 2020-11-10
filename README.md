[![png](magrit_app/static/img/magrit_banner.png)](http://magrit.cnrs.fr)  
[![riate](https://github.com/riatelab/magrit/raw/master/magrit_app/static/img/riate_blue_red.png)](http://riate.cnrs.fr)   
[![Release name](https://img.shields.io/github/release/riatelab/magrit.svg)](https://github.com/riatelab/magrit/releases)
[![Build Status](https://travis-ci.org/riatelab/magrit.svg?branch=master)](https://travis-ci.org/riatelab/magrit)
[![Docker Build Status](https://img.shields.io/docker/build/magrit/magrit.svg)](https://hub.docker.com/r/magrit/magrit/)   

[en] [Magrit](http://magrit.cnrs.fr) is an online mapping application developed by [UMS RIATE](http://www.riate.cnrs.fr).  
[fr]  [Magrit](http://magrit.cnrs.fr) est une application de cartographie thématique développée par l'[UMS RIATE](http://www.riate.cnrs.fr).

## Basics
- Magrit is an online application for thematic mapping (*cartography*).
- It's intentionally simple (the UI follows the basic steps of map creation).
- It's **designed for teaching and learning cartography**.
- It lets you import **your own geometry dataset** (**Shapefile**, **GeoJSON**, **GML**, etc.) and optionnaly your **tabular file**.
- We also provide many sample datasets to try out the various representations and become familiar with the application.
- It allows to **render and combine a wide variety of maps**: choropleth, proportional symbols, cartogram, discontinuity, etc.
- It supports the most popular modern desktop browsers: Chrome, Firefox and Opera (+ Edge and Safari with limitations).
- Server-side, Magrit is backed by a python 3.6+ application (particularly for some geoprocessing tasks relying on GDAL, GEOS and PROJ.4 libraries).
- Client-side, Magrit is written in modern JS (ES6) and uses notably the d3.js library.


## Usage
Most users should go on :
- the [application page](http://magrit.cnrs.fr)
- the [user documentation](http://magrit.cnrs.fr/docs/)
- the [blog](http://magrit.hypotheses.org)


## Examples
<p><img src="https://github.com/mthh/example-magrit-projects/raw/master/nuts3_cagr2.png" height="220"/><img src="https://github.com/mthh/example-magrit-projects/raw/master/cinema_pot2.png" height="220"/><img src="https://magrit.hypotheses.org/files/2017/02/worldpop.png" height="220"/></p>

More maps are available in the [gallery](http://magrit.hypotheses.org/galerie).


## Simple installation / Installation for development
The only targeted/tested OS for development is currently GNU/Linux.   
However, you can install it on other platforms, which are supported by Docker (GNU/Linux, FreeBSD, Windows 64bits, MAC OSX) which is the preferred solution if you want to install Magrit for using it but don't want to do any development:   
- [Installation with Docker](https://github.com/riatelab/magrit/wiki/Installation-with-Docker)

To install Magrit directly on your GNU/Linux system you have to install some shared libraries and python libraries.
Once installed, the python server application can take care to concatenate/transpile/etc. the JS and CSS code.
These steps are detailed in the Wiki and in the `CONTRIBUTING.md` file:
- [Installing for development](https://github.com/riatelab/magrit/wiki/Installation-for-development)
- [Installing for development (with a python virtual environnement)](https://github.com/riatelab/magrit/wiki/Installation-for-development)
- [Instructions for contributions](https://github.com/riatelab/magrit/blob/master/CONTRIBUTING.md)


## Contributing to Magrit
Contributions are welcome! There are various way to contribute to the project which are detailed in [CONTRIBUTING](https://github.com/riatelab/magrit/blob/master/CONTRIBUTING.md) file! You can notably:
- Report bugs or send us feedback.
- Add new translations or fix existing ones.
- Contribute code (you're in the right place! Clone the repo, fix what you want to be fixed and submit a pull request).
- Contribute to the [gallery](http://magrit.hypotheses.org/galerie) by submitting your best maps.
