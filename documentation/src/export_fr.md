Export
===================

Magrit offre plusieurs possibilités d'export :
- export de la carte réalisée (format vectoriel ou raster),
- export des couches géographiques utilisées ou créées par l'application,
- export du projet complet (données, fonds de cartes et cartes) pour le partager ou le réutiliser plus tard.

<p style="text-align: center;">
<img src="img/win_exp_fr.png" alt="Dialogue d'export">
</p>

## Export au format SVG

<p style="text-align: center;">
<img src="img/win_svg_fr.png" alt="Dialogue d'export"/>
</p>

Grâce à cette méthode il est possible d'exporter le rendu actuel selon les spécifications *SVG 1.2*.

> **Note:**
> * Les exports SVG fournis par l'application visent en priorité l'affichage de l'image par un navigateur web et/ou son édition par un outil comme [Inkscape], Adobe Illustrator ou [SVGEdit].



## Export au format PNG

<p style="text-align: center;">
<img src="img/win_exp_fr.png" alt="Dialogue d'export"/>
</p>

Cette méthode permet d'exporter la carte dans un format "raster", c'est à dire composé de pixels.
La résolution de ce type de fichier est fixe et il est proposé de choisir la résolution en fonction de son futur usage (affichage écran, impression petit ou grand format, etc.).


## Export d'un fichier de couche géographique
<p style="text-align: center;">
<img src="img/win_geo_fr.png" alt="Dialogue d'export"/>
</p>

Les formats proposés à l'export sont les mêmes que ceux acceptés lors de l'import :
- ```GeoJSON```
- ```TopoJSON```
- ```Shapefile```
- ```KML```
- ```GML```

Différents systèmes de projection sont proposés par défaut lors de l'export mais il est possible de choisir tout type de système de référence supporté par le projet [Proj.4].  
Les couches qui peuvent être exportées par cette fonctionnalité sont celles importées pour la réalisation de la carte ainsi que celles créées par certains modes de représentations (carroyages, cartogrammes, discontinuités, liens et cartes lissées).

## Sauvegarde du projet en cours
<p style="text-align: center;">
<img src="img/win_prj_fr.png" alt="Dialogue d'export"/>
</p>


Cette fonctionnalité permet de sauvegarder l'état d'une session et de l'exporter au format *JSON*.
Le fichier exporté pourra être ouvert à nouveau, depuis n'importe quel poste, et permet de continuer la session de travail.
Cette fonctionnalité de sauvegarde du projet est activée automatiquement lorsque l'utilisateur quitte la page; la session est alors sauvegardée localement dans le navigateur pour une éventuelle reprise ultérieure.


  [Inkscape]: https://inkscape.org
  [SVGEdit]: https://github.com/SVG-Edit/svgedit
  [Proj.4]: https://github.com/OSGeo/proj.4/wiki
