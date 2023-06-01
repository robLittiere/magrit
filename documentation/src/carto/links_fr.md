# Carte des liens

Ce type de carte représente, avec des lignes d'épaisseur proportionnelle à l'intensité du phénomène, les connexions (flux/liens) qui existent entre des couples de lieux.
Différents éléments, tels que la présence de chevauchements trop nombreux, peuvent nuire à la lisibilité de ce type de représentation.  
Ce type de carte requiert généralement d'effectuer une sélection après le premier rendu, consistant par exemple à ne pas représenter les flux les plus faibles.  

Magrit propose de représenter l'épaisseur de la ligne de plusieurs façons : **en discrétisant les valeurs à utiliser** (choix d'un type de discrétisation et d'un nombre de classes, permettant parfois une meilleure hiérarchisation des informations) ou **sans discrétiser les valeurs** (l'épaisseur des lignes est ainsi strictement proportionnelle à la valeur de son intensité).

> ### Paramètres
> * Le champ du jeu de données externe contenant les identifiants des entités 'origine'.
> * Le champ du jeu de données externe contenant les identifiants des entités 'destination'.
> * Le champ du jeu de données externe contenant les valeurs de l'intensité du phénomène entre 'i' et 'j'.
> * Le champ du fond de carte (de type *identifiant*) contenant les identifiants des entités.
> * Le choix entre des liens proportionnels (sans discrétisation) ou le choix d'un type de méthode à utiliser pour discrétiser les valeurs.
> * Le cas échéant, le nombre de classes à créer lors de l'application de la méthode précédemment définie.

#### Exemple :

<p style="text-align: center;">
<img src="img/flows.png" alt="link_map" style="width: 480px;"/>
</p>

#### Informations sur le format des données attendues :

La table de données à joindre doit être dans un format supporté par l'application (format .csv, .xls/.xlsx ou .ods). Cette table doit contenir au minimum 3 colonnes : les identifiants des entités d'origine, les identifiants des entités de destination, les valeurs correspondants à l'intensité du phénomène mesuré. La première ligne de cette table est à réserver au nom de colonne; chacune des lignes suivantes décrit un lien, entre un couple de lieu, à créer sur la carte.  
Ainsi, les premières lignes d'une table décrivant des liens entre pays européens pourraient être écrites :  


| Origine       | Destination   | Valeur  |
| ------------- |:-------------:| -----:|
| BE            | LUX           | 12    |
| BE            | FR            | 8     |
| BE            | DE            | 10    |
| LUX           | DE            | 6     |
| LUX           | FR            | 3     |


Une table d'exemple de ce type peut être téléchargée ci-dessous; lorsqu'elle est utilisée avec le fond des pays européens, également ci-dessous, elle permet la réalisation d'une carte de lien en sélectionnant les champs suivants :  
- *Champ origine* : **i**  
- *Champ destination* : **j**  
- *Champ intensité* : **fij**  

<p><a href="https://raw.githubusercontent.com/riatelab/magrit/master/magrit_app/static/data_sample/links.csv">Table d'exemple</a></p>
<p><a href="https://raw.githubusercontent.com/riatelab/magrit/master/magrit_app/static/data_sample/nuts0.geojson">Fond de carte des pays européens</a></p>
