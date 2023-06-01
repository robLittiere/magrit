## Typage des données

À chaque type de données est associé un certain nombre de modes de représentation possibles. Une fois les données importées il est donc important de définir le type de chacune des variables à cartographier.

5 types de données sont possibles :
- *Identifiant* (champs notamment utilisés pour joindre les données)
- *Stock*
- *Ratio*
- *Catégorie*
- *Inconnu* (champs non cartographiables)

### Stock
Les variables quantitatives de stock expriment des quantités concrètes et leur somme ont un sens (nombre de chômeurs, population totale, par exemple).
La représentation de ce type de phénomènes doit respecter l’expression de ces quantités et les différences de proportionnalité entre les différents éléments qui en découlent.
Exemples : Population totale en milliers d'habitants, Superficie en hectares.

### Ratios
Les variables quantitatives de taux, ou ratios, expriment un rapport entre deux quantités dont la somme n’a pas de signification. Par extension, on peut y associer les indicateurs composites numériques associant plusieurs indicateurs (indices…).
Exemples : PIB par habitant, Indicateur de développement humain.

### Catégories
Les modalités des caractères qualitatifs ne sont pas mesurables, ce sont des noms, des sigles ou des codes. On ne peut sommer des modalités qualitatives, on ne peut en calculer la moyenne.
Exemples : Noms des départements, Type d'occupation du sol.

### Identifiant
Ce champ contient des valeurs permettant d'identifier de manière unique chacune des entités de la couche de données.  
Ces sont ces champs qui sont utilisés pour effectuer une jointure de données.  
Les valeurs de ces champs sont également transférées aux entités correspondantes dans les représentations qui le permettent (symboles proportionnels, cartogrammes, cartes choroplèthes, cartes qualitatives par à-plat de couleurs ou par utilisation de pictogrammes).
Exemple: Code INSEE de la commune, Code ISO2 d'un pays.

<p style="text-align: center;">
<img src="img/win_typ_fr.png" alt="Dialogue de typage des données"/>
</p>
