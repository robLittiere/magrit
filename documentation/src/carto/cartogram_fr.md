# Cartogramme

Les anamorphoses sont utilisées en cartographie statistique pour montrer l'importance d'un phénomène donné : ce type de carte est couramment appelé un cartogramme.  
Elles permettent de déformer les unités territoriales (polygones) sur la base d'un attribut rapporté à la superficie des entités (densité).  
Deux méthodes de création de cartogrammes sont disponibles dans Magrit :
  - la première, basée sur l'algorithme de Dougenik et al. (1) permet la création de cartogrammes "contigu" (la topologie du fond de carte est préservée tant que possible),
  - la seconde, basée sur l'algorithme de Olson (2) permet la création de cartogrammes "non-contigu" (la méthode ne cherche pas à préserver la topologie du fond de carte).

> ### Paramètres (méthode Dougenik)
> * Le nom du champ contenant les valeurs à utiliser
> * Le nombre d'itérations à effectuer avant d'obtenir le résultat
> * Le nom de la couche produite


> ### Paramètres (méthode Olson)
> * Le nom du champ contenant les valeurs à utiliser
> * Le nom de la couche produite

#### Exemple :

<p style="text-align: center;">
<img src="img/dougenik.png" alt="dougenik_map" style="width: 480px;"/>
</p>

- Méthode de **Dougenik**
- Champ utilisé : **pop2008**
- **5 itérations**

(1) Dougenik, James A.; Chrisman, Nicholas R.; Niemeyer, Duane R. (1985), "An Algorithm to Construct Continuous Area Cartograms", The Professional Geographer, n°37.  
(2) Olson, Judy M. (1976). Noncontiguous Area Cartograms. Professional Geographer, n°28.
