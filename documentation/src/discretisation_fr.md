Discrétisation
===================

Plusieurs méthodes sont proposées afin de transformer une série continue de valeurs en une série discrète, c'est à dire en un nombre fini de classes. Le nombre de classes ainsi que les valeurs limites de ces classes doivent être justifiées sémantiquement et/ou statistiquement.

Les méthodes proposées par l'outil peuvent être utilisées telles quelles ou bien comme des guides de lecture et d'analyse préalables à la saisie manuelle des limites de classes souhaitées.

----------


- **Intervalles égaux**  
Cette méthode, parfois également appelées "amplitudes égales", permet de créer des classes qui possèdent toutes la même étendue.


- **Quantiles**  
Cette méthode, parfois également décrite par le terme de "discrétisation en classes d'effectifs égaux" permet de former des classes qui possèdent toutes le même nombre d'individus.


- **Q6**  
Cette méthode originale, notamment démocratisée par l'outil <a href="http://philcarto.free.fr/">PhilCarto</a>, permet d'effectuer une discrétisation selon la méthode des quartiles tout en isolant les valeurs extrêmes.


- **Seuils naturels (algorithme de <a href="https://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization">Jenks</a>)**  
Cette méthode permet de créer des classes homogènes. En effet l'algorithme vise à trouver le nombre de classe souhaitées en minimisant la variance intra-classe et en maximisant la variance inter-classe.


- **Moyenne et écart-type**  
Cette méthode propose de former des classes en fonction de la valeur de l'écart-type et de la moyenne. Ce mode de discrétisation ne permet pas de choisir directement un nombre de classe mais permet de choisir la portion d'écart-type qui correspond à la taille d'une classe ainsi que le rôle de la moyenne (utilisée comme borne de classe ou comme centre de classe).

- Il est également possible d'utiliser les discrétisations en **progression arithmétique**, en **progression géométrique** ou de **saisir manuellement les bornes de classes**.


Le panneau principal de la boite de dialogue représente la distribution dans le nombre de classes désirées, avec des rectangles dont les surfaces correspondent à la fréquence relative d'observations dans la classe correspondante.
C'est également dans ce panneau que se trouve le possibilité de changer le type de discrétisation, le nombre de classes souhaitées ainsi que la ou les progression(s) colorée(s) à utiliser.
Les palettes proposées proviennent de l'outil [__*ColorBrewer*__](http://colorbrewer2.org) (projet sous Licence Apache 2.0. Crédits: *Cynthia Brewer, Mark Harrower and The Pennsylvania State University*).

Le panneau supérieur droit présente la distribution non-discrétisée selon 3 représentations (histogramme, boite à moustaches et *essaim d'abeilles*).
La représentation sous forme de boite à moustaches permet de visualiser plusieurs caractéristiques de position de la série statistique (médiane, quartiles, minimum et maximum).

<p style="text-align: center;">
<img src="img/box_plot.svg" alt="Box plot" style="width: 450px;"/>
</p>

Vous pouvez consulter l'article <a href="http://mappemonde.mgm.fr/119geov1/">Géovisualisation des discrétisations : une petite application pédagogique</a>, dans la revue *MappeMonde* n°119, qui met en avant l'importance du choix d'une discrétisation adaptée en cartographie.
