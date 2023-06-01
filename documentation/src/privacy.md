### Utilisation des cookies et respect de la vie privée

Plusieurs *cookies* et fonctionnalités de *stockages temporaires*, locales et distantes, sont utilisés par l'application. Toutes se veulent non-intrusives et nous nous engageons à ce que les données envoyées/traitées par l'application ne soient utilisées et accessibles qu'à l'utilisateur à qui elles appartiennent.

#### Quelques détails permettant de comprendre le chemin des données :
Lors de l'import d'une couche utilisateur, celle-ci est transformée et stockée temporairement (le temps d'une session utilisateur) en mémoire temporaire (via [redis](https://fr.wikipedia.org/wiki/Redis)). C'est cette couche transformée qui est affichée dans le navigateur web.

Lors du calcul d'une représentation générant une nouvelle géométrie (carte lissée, carroyage, discontinuité, cartogramme et liens), le résultat est également stocké en mémoire temporaire (redis) le temps de votre session.

Ce stockage permet d'une part de lancer les calculs dès le choix des paramètres effectué par l'utilisateur (sans avoir à envoyer les géométries à nouveau) et d'autres part de proposer des exports dans des formats "géographiques" variés lorsque l'utilisateur le souhaite.
Ces couches sont supprimées lors de la fermeture de la session par l'utilisateur.

#### Détails des cookies utilisés :
La mémorisation de ces couches le temps d'une session est rendue possible par l'utilisation d'un **cookie**, dont la durée d'expiration est celle d'une **session**, contenant une clé échangée avec le serveur.

Deux autres cookies sont utilisés et ne sont pas échangés avec le serveur :
- un cookie est utilisé pour se souvenir de la dernière langue utilisée par l'utilisateur (il est paramétré avec une durée d'expiration longue).
- un cookie est utilisé pour se souvenir de l'acceptation de l'usage des cookies par l'utilisateur (il est paramétré avec une durée d'expiration longue).

#### Autre fonctionnalité de stockage :
La fonctionnalité proposant de reprendre le projet en cours se base sur la capacité de "stockage local" (*[localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)*) des navigateurs web. Le projet en cours est donc intégralement stocké dans le navigateur de l'utilisateur et le serveur n'en a pas connaissance
(de même qu'il n'a pas connaissance des fichiers-projets exportés par l'utilisateur).

##### Garanties supplémentaires
Il facilement possible de déployer une instance locale (sur votre réseau d'entreprise ou votre ordinateur personnel) afin de ne pas faire transiter les données vers notre instance. Des informations sont disponibles sur la [page Github du projet](http://github.com/riatelab/magrit) et peuvent être complétées en contactant l'équipe via la page contact.
