# Carte des discontinuités

Les cartes de discontinuités mettent en avant les limites (ou "frontières") entre les entités étudiées, en leur affectant une épaisseur relative au différentiel de valeur existant entre elles.
Deux méthodes permettent de calculer ce différentiel, on parlera ainsi soit de **discontinuité absolue** (écart absolu entre les valeurs de la variable étudiée c'est à dire *max(A,B) - min(A,B)*) ou de **discontinuité relative** (rapport *max(A,B) / min(A,B)*).
La visualisation de lignes de discontinuités permet de mettre en exergue les ruptures spatiales des phénomènes socio-économiques étudiés, qui selon la formule de Brunet et Dolphus (1990) montre que *« l’espace géographique est fondamentalement discontinu »*. Cette représentation est particulièrement pertinente lorsqu'elle peut être combinée à une représentation par aplats de couleurs (Cf. cartes de ratio).

> ### Paramètres
> * Le champ contenant les valeurs à utiliser.
> * Le champ contenant des identifiants uniques permettant d'identifier les tronçons.
> * Le type de discontinuités (c'est à dire le rapport entre la valeur des deux entités, parmi 'relatif' ou 'absolu').
> * Le nombre de classes à créer.
> * La méthode utilisée pour discrétiser les valeurs.
> * La couleur utilisée pour représenter les discontinuités.


#### ExempleW :

<p style="text-align: center;">
<img src="img/discont.png" alt="discont_map" style="width: 480px;"/>
</p>
