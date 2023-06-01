## Jointure des données

Lorsqu'un fond de carte et un jeu de données externes ont été ajoutés, il devient possible d'associer le fond de carte et ce jeu de données. Cette association est possible grâce à la **correspondance entre les valeurs d'identifiants** se trouvant dans le fond de carte et celles se trouvant dans la table de données.
Cette opération est appelée "**jointure**" (c'est également le cas dans les logiciels SIG ou les systèmes de gestion de bases de données) et s'effectue ici simplement en choisissant le nom de la colonne contenant des valeurs d'identifiants dans le jeu de données et dans le fond de carte.  
Pour assurer le bon fonctionnement de cette méthode, les valeurs prisent par les identifiants , d'une part pour le fond de carte et d'autre part pour le jeu de données externe, doivent être uniques.

<p style="text-align: center;">
<img src="img/win_jnt_fr.png" alt="Dialogue de jointure"/>
</p>

> <img src="img/joinfalse.png" alt="joinfalse" style="width: 35px;"/> Apparence de l'élément avant jointure  
> <img src="img/jointrue.png" alt="jointrue" style="width: 35px;"/> Apparence de l'élément après jointure des champs  


Exemple des valeurs attributaires du fond de carte (avant jointure) :  


| Id       | Nom             |
| ---------| ---------------:|
| BE       | Belgique        |
| DE       | Allemagne       |
| LU       | Luxembourg      |
| FR       | France          |
| GB       | Grande-Bretagne |



Exemple des valeurs attributaires du jeu de données externe :  


| ISO2     | JAMESBOND_VISITES | POP_DENSITY    |
| ---------|:-----------------:| --------------:|
| FR       | 4                 | 117.6          |
| LU       | 0                 | 218.9          |
| DE       | 2                 | 231.5          |
| GB       | 22                | 267.5          |
| BE       | 0                 | 373.1          |




Exemple des valeurs attributaires du fond de carte (après jointure avec le jeu de données externe, en utilisant respectivement les champs **Id** et **ISO2**) :  


| Id       | Nom             | ISO2     | JAMESBOND_VISITES | POP_DENSITY    |
| ---------| ---------------:| ---------|:-----------------:| --------------:|
| BE       | Belgique        | BE       | 0                 | 373.1          |
| DE       | Allemagne       | DE       | 2                 | 231.5          |
| LU       | Luxembourg      | LU       | 0                 | 218.9          |
| FR       | France          | FR       | 4                 | 117.6          |
| GB       | Grande-Bretagne | GB       | 22                | 267.5          |
