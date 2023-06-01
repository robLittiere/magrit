# Carte de stocks

Ces cartes permettent de représenter des **données de stocks** (ou quantitatives absolues) par des **figurés proportionnels**. Les données de stocks expriment des quantités concrètes : la somme des modalités des éléments a un sens.


> #### Paramètres
> * Le champ contenant les valeurs à utiliser.
> * La taille (en pixels) à appliquer sur la valeur définie à la suite.
> * Le type de symbole à utiliser (cercle ou carré).
> * Le souhait ou non d'éviter le chevauchement des symboles (voir plus bas).
> * La couleur des symboles. Il est possible de choisir deux couleurs si un seuil est défini.


#### Chevauchement des symboles

Magrit propose une option permettant d'éviter le chevauchement des symboles proportionnels qui sont dessinés.
Cette méthode est empruntée aux cartogrammes de Dorling (utilisation de cercles, cf. (1)) et aux cartogrammes de Demers (utilisation de carrés, cf. (2)).

La méthode utilisée cherche à placer les symboles proportionnels de manière à ce qu'ils ne se chevauchent pas tout en minimisant le déplacement par rapport à leur position initiale.

Il est possible de choisir un nombre d'itérations pour cette option. Plus le nombre d'itérations est élevé, meilleur est le résultat, au détriment d'un temps de calcul plus élevé. Par défaut, lors de la création de la couche, le nombre d'itérations est de 75.


#### Exemple 1 :

<p style="text-align: center;">
<img src="img/propsymbol.png" alt="img_propsymbol_map" style="width: 480px;"/>
</p>

- Données : **Pays du monde**
- Champ utilisé : **jamesbond**
- Symbole : **cercle**
- Éviter le chevauchement des symboles : **Non**
- Taille fixée à **40px** sur la valeur **22**

#### Exemple 2

<p style="text-align: center;">
<img src="img/prop-no-overlapping.png" alt="img_propsymbol_no_overlapping_map" style="width: 480px;"/>
</p>

- Données : **Pays du monde**
- Champ utilisé : **jamesbond**
- Symbole : **cercle**
- Éviter le chevauchement des symboles : **Oui**
- Taille fixée à **40px** sur la valeur **22**

#### Références

(1) Dorling, D. (1994) Cartograms for visualizing human geography, in D. Unwin and H. Hearnshaw (eds), Visualization and GIS, London: Belhaven Press. 85‐102.

(2) Bortins, I., Demers, S., Clarke, K. (2002) "Cartogram types". Disponible en ligne : [http://www.ncgia.ucsb.edu/projects/Cartogram_Central/types.html](http://www.ncgia.ucsb.edu/projects/Cartogram_Central/types.html).
