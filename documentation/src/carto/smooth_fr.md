# Carte lissée


Méthode d'analyse spatiale et de représentation basée sur le calcul de potentiels (dit \"de Stewart\") et qui n’a pas vocation à annuler ou atténuer le bruit (information parasite qui tend à brouiller la lecture) mais s’affranchit complètement du maillage administratif de départ. Elle permet d’observer ainsi la répartition spatiale du phénomène étudié, quelque soit l’hétérogénéité du maillage affecté en tout point de la carte, la valeur de la densité du phénomène dans le voisinage de ce point. En fonction des paramètres utilisés, cette méthode permet *"de voir aussi bien les spécificités locales d'un phénomène que ses tendances générales"* (Lambert & Zanin, 2016).
La [vignette du *package* R `potential`](https://cran.r-project.org/web/packages/potential/vignettes/potential.html) explique la méthodologie utilisée dans le détail.  

> ### Paramètres
> * Le nom du champ contenant les valeurs à utiliser.
> * *(optionnel)* Le nom du champ à utiliser pour calculer un ratio.
> * Le *span* (la "portée" de la fonction d'interaction) détermine la distance du voisinage pris en compte.
> * Le paramètre *beta* (la "friction de la distance"), c'est à dire la pente de la fonction mathématique qui agit sur une prise en compte plus ou moins importante de la distance.
> * La résolution de la grille régulière créée pour l'interpolation (en *km*).
> * Le type de fonction d'interaction.
> * Le nombre de classes souhaité lors de la création des isolignes.
> * *(optionnel)* Le nom de la couche de masquage.


#### Exemple :

<p style="text-align: center;"> <img src="img/smoothed2.png" alt="smoothed_map" style="width: 480px;"/> </p>
