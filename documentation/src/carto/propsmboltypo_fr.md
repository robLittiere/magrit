# Carte de stocks et qualitative

Ce type de représentation permet d'établir une correspondance entre des données de stock et une variable d'appartenance (variable catégorielle).


> ### Paramètres
> * Le nom du champ contenant les valeurs à utiliser pour définir la taille des symboles.
> * La taille (en pixels) à appliquer à la valeur définie à la suite.
> * La valeur sur laquelle fixer la taille.
> * Le type de symbole à utiliser (cercle ou carré).
> * Le souhait ou non d'éviter le chevauchement des symboles (voir plus bas).
> * Le nom du champ contenant les valeurs à utiliser pour colorer les symboles.
> * Le choix des couleurs correspondantes aux catégories à représenter.


#### Exemple 1 :

<p style="text-align: center;">
<img src="img/propsymboltypo_map.png" alt="img_propsymboltypo_map" style="width: 480px;"/>
</p>

- Champ utilisé : **pop1999**
- Symbole **carré**
- Éviter le chevauchement des symboles : **Non**
- Taille fixée de **22px** sur la valeur **1000000**
- Champ utilisé pour l'aplat de couleur : **Pays**

#### Exemple 2 :

<p style="text-align: center;">
<img src="img/propsymboltypo-overlap.png" alt="img_propsymboltypo_overlap" style="width: 480px;"/>
</p>


- Jeu de données : **Quartiers de Paris**
- Champ utilisé : **P12_POP**
- Symbole **cercle**
- Éviter le chevauchement des symboles : **Non**
- Taille fixée de **80px** sur la valeur **86940**
- Champ utilisé pour l'aplat de couleur : **c_ar**


#### Exemple 3 :

<p style="text-align: center;">
<img src="img/propsymboltypo-no-overlap.png" alt="img_propsymboltypo_no_overlap" style="width: 480px;"/>
</p>

- Jeu de données : **Quartiers de Paris**
- Champ utilisé : **P12_POP**
- Symbole **cercle**
- Éviter le chevauchement des symboles : **Oui**
- Taille fixée de **80px** sur la valeur **86940**
- Champ utilisé pour l'aplat de couleur : **c_ar**