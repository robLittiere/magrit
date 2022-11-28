[![png](magrit_app/static/img/magrit_banner.png)](https://magrit.cnrs.fr)  
[![riate](https://github.com/riatelab/magrit/raw/master/magrit_app/static/img/riate_blue_red.png)](https://riate.cnrs.fr)   
[![Release name](https://img.shields.io/github/release/riatelab/magrit.svg)](https://github.com/riatelab/magrit/releases)

<!--
[![Docker Build Status](https://img.shields.io/docker/cloud/build/magrit/magrit)](https://hub.docker.com/r/magrit/magrit/)   
-->

[en] [Magrit](https://magrit.cnrs.fr) is an online mapping application developed by [UAR RIATE](https://riate.cnrs.fr/).  
[fr]  [Magrit](https://magrit.cnrs.fr) est une application de cartographie thématique développée par l'[UAR RIATE](https://riate.cnrs.fr/).

## Basics
- Magrit is an online application for thematic mapping (*cartography*).
- It's intentionally simple (the UI follows the basic steps of map creation).
- It's **designed for teaching and learning cartography**.
- It lets you import **your own geometry dataset** (**Shapefile**, **GeoJSON**, **GML**, etc.) and optionally your **tabular file**.
- We also provide many sample datasets to try out the various representations and become familiar with the application.
- It allows to **render and combine a wide variety of maps**: choropleth, proportional symbols, cartogram, discontinuity, etc.
- It supports the most popular modern desktop browsers: Chrome, Firefox and Opera (+ Edge and Safari with limitations).
- Server-side, Magrit is backed by a python 3 application (particularly for some geoprocessing tasks relying on GDAL, GEOS and PROJ libraries).
- Client-side, Magrit is written in modern JS (ES6) and uses notably the d3.js library.


## Usage
Most users should go on :
- the [application page](https://magrit.cnrs.fr)
- the [user documentation](https://magrit.cnrs.fr/docs/)
- the [blog](https://magrit.hypotheses.org)


## Examples
<p style="text-align: center;"><img src="https://github.com/mthh/example-magrit-projects/raw/master/nuts3_cagr2.png" height="210"/><img src="https://github.com/mthh/example-magrit-projects/raw/master/cinema_pot2.png" height="210"/><img src="https://magrit.hypotheses.org/files/2017/02/worldpop.png" height="210"/></p>

<p style="text-align: center;"><img src="https://magrit.hypotheses.org/files/2022/11/emission-co2-900x854-1.png" height="202" /><img src="https://magrit.hypotheses.org/files/2022/11/wolrd-pop-point-bertin.png" height="202" /><img src="https://magrit.hypotheses.org/files/2022/11/structure-peuplement.png" height="202" style="background: white" /></p>

More maps are available in the [gallery](https://magrit.hypotheses.org/galerie).


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
Contributions are welcome! There are various ways to contribute to the project which are detailed in [CONTRIBUTING](https://github.com/riatelab/magrit/blob/master/CONTRIBUTING.md) file! You can notably:
- Report bugs or send us feedback.
- Add new translations or fix existing ones.
- Contribute code (you're in the right place! Clone the repo, fix what you want to be fixed and submit a pull request).
- Contribute to the [gallery](https://magrit.hypotheses.org/galerie) by submitting your best maps.
