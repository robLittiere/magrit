## Import du fond de carte

L'import du fond de carte principal peut se faire de différentes manières :
- Par un clic sur le bouton *Ajout d'un fond de carte*.
- Par un glisser-déposer dans la zone de la carte.


Plusieurs formats sont supportés:
- ```Shapefile```
- ```GeoJSON```
- ```TopoJSON```
- ```kml```
- ```gml```
- ```csv``` (contenant des colonnes x/y)

> **Note:**
> La plupart des formats permettent de spécifier un système de coordonnées de référence; cette indication est ici obligatoire pour ouvrir correctement le fichier (présence du fichier ```.prj``` pour le format ShapeFile par exemple)
> Si aucun système de coordonnées de référence n'est spécifié, l'application considère qu'il s'agit de coordonnées géographiques.
> Les spécifications des formats [KML](http://www.gdal.org/drv_kml.html) et [GeoJSON](https://tools.ietf.org/html/rfc7946#section-4) imposent l'utilisation de coordonnées géographiques (*EPSG:4326 / urn:ogc:def:crs:OGC::CRS84* )
