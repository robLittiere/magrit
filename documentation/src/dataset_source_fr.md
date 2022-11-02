Source des données d'exemples
=============================

### Communes de la métropole du Grand-Paris :   

Fond de carte : Institut national de l’information géographique et forestière (1)  
Variables :    
- IDCOM : code communal (2)  
- LIBCOM : nom de la commune (2)     
- EPT : code le l’Établissement Public Territorial (3)     
- LIBEPT : nom de l’Établissement Public Territorial (3)  
- DEPARTEMENT : code du département (2)     
- REVENUS : somme des revenus déclarés par les ménages (4)    
- MENAGES_FISCAUX : nombre de ménages fiscaux (4)  
- REVENUS_PAR_MENAGE : revenu moyen par ménage fiscal   

(1) : IGN, <a href="http://professionnels.ign.fr/geofla">GEOFLA® 2015 v2.1 Communes France Métropolitaine</a>  
(2) : INSEE, 2016  
(3) : <a href="http://www.apur.org/article/composition-12-territoires-metropole-grand-paris">Atelier parisien d'urbanisme</a> 2016   
(4) : Direction générale des finances publiques, impôts de 2014 sur les revenus de 2013  


### États fédéraux brésiliens :

Fond de carte :    
Variables :  
- ADMIN_NAME : Nom de l’État
- Abbreviation : Abréviation du nom
- Capital : Nom de la capitale administrative de l’État (2)
- GDP_per_capita_2012 : Produit intérieur brut (PIB) par habitant
- Life_expectancy_2014 : Espérance de vie à la naissance (2)
- Pop2014 : Population de l’État (1)
- REGIONS : Nom de la région d'appartenance
- STATE2010 : Code de l’État
- popdensity2014 : Densité de population en habitants par kilomètres carrés

(1) : '2014 IBGE Estimates - Estimates of Resident Population in Brazil, Federative Units and Municipalities" (PDF) (en Portugais). <a href="ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2014/estimativa_dou_2014.pdf">ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2014/estimativa_dou_2014.pdf</a>. Consulté le 25 janv. 2017.  
(2) : Wikipedia. https://fr.wikipedia.org/wiki/%C3%89tats_du_Br%C3%A9sil#Listes_des_%C3%89tats_du_Br%C3%A9sil. Consulté le 25 janv. 2017.  


### Communes de Martinique :

Fond de carte : Institut national de l’information géographique et forestière (1)  
Variables :  
- INSEE_COM : Code INSEE de la commune (1)
- NOM_COM : Nom de la commune (2)
- STATUT : Statut administratif de la commune (2)
- POP2013 : Population de la commune (2)
- DENSPOP : Densité de population en habitants par kilomètres carrés (2)
- NbLogements : Nombre de logements (2)
- NbLogementsVacants : Nombre de logements vacants (2)
- PartLogementVacants : Taux d'occupations des logements (2)

(1) : IGN, <a href="http://professionnels.ign.fr/geofla">GEOFLA® 2015 v2.1 Communes Martinique</a>  
(2) : INSEE 2013


### Régions européennes NUTS 2 et NUTS 3, version 2020 :

Fond de carte : ©EuroGeographics
Variable :  
- NUTS_ID : Code d'identification NUTS
- NAME_LATN : Nom NUTS en langue locale, translittéré en caractères latins
- URBN_TYPE : Typologie urbaine-rurale pour les régions NUTS3 (1 : région à prédominance urbaine ; 2 : région intermédiaire ; 3 : région à prédominance rurale).
- MOUNT_TYPE : Typologie de la montagne pour les régions NUTS3 (1 : "dont plus de 50 % de la surface est couverte par des zones de montagne topographiques" ; 2 : "dont plus de 50 % de la population régionale vit dans des zones de montagne topographiques" ; 3 : "dont plus de 50 % de la surface est couverte par des zones de montagne topographiques et dont plus de 50 % de la population régionale vit dans ces zones de montagne", 4 : région non montagneuse / autre région, 0 : aucune classification fournie (par ex. 0 : aucune classification n'est fournie (par exemple, dans le cas des NUTS 1 et NUTS 2 et des pays non membres de l'UE).
- COAST_TYPE : Typologie côtière pour les régions NUTS3 (1 : côtière (sur la côte), 2 : côtière (>= 50% de la population vivant à moins de 50km de la côte), 3 : région non côtière}, 0 : aucune classification fournie (par exemple dans le cas des régions NUTS 1 et NUTS 2).
- AREA_2021 : Superficie totale en 2021 (ou 2019-2020 si valeurs manquantes, table Eurostat reg_area3)
- POP_2021 : Population totale en 2021 (ou 2019-2020 si valeurs manquantes, table Eurostat demo_r_pjanaggr3)
- DENS_2021 : Densité de population (hab. par km², POP_2021 / AREA_2021).


### Régions européennes NUTS 0 et NUTS 1, version 2020 :

Fond de carte : ©EuroGeographics
Variable :  
- NUTS_ID : Code d'identification NUTS
- AREA_2021 : Superficie totale en 2021, calculé par aggrégation des NUTS2 enfants (ou 2019-2020 si valeurs manquantes, table Eurostat reg_area3)
- POP_2021 : Population totale en 2021, calculé par aggrégation des NUTS2 enfants (ou 2019-2020 si valeurs manquantes, table Eurostat demo_r_pjanaggr3)


### Pays du monde :   

Fond de carte : UMS RIATE, 2022  
Variables :   
- ISO2 : Code ISO 3166-1 alpha-2
- ISO3 : Code ISO 3166-1 alpha-3
- ISONUM : Code ISO 3166-1 numeric
- NAMEen : Nom du pays en anglais
- NAMEfr : Nom du pays en français
- UNRegion : Régions macrogéographiques (1)
- GrowthRate : Taux de croissance annuel moyen de la population en % (2)
- PopDensity : Densité de population en habitants par kilomètres carrés (2)
- PopTotal : Population totale (2)
- JamesBond : Nombre de fois ou James Bond s'est rendu dans le Pays (3)

(1) : United Nations Statistics Division, <a href="http://unstats.un.org/unsd/methods/m49/m49regnf.htm">http://unstats.un.org/unsd/methods/m49/m49regnf.htm</a>  
(2) : Population Division of the Department of Economic and Social Affairs of the United Nations Secretariat, World Population Prospects: The 2015 Revision, <a href="http://esa.un.org/unpd/wpp/index.htm">http://esa.un.org/unpd/wpp/index.htm</a>, July 2015, Variant : Medium, Année 2015)  
(3) : UMS RIATE d'après Wikipedia, de Dr. No en 1962 à Spectre en 2015  


### Communes de France métropolitaine 2022 - fond *voronoi* :  

Localisation des centroides ayant permis la construction des polygones de voronoi : Institut national de l’information géographique et forestière (1)
Trait de cote ayant servi au découpage des polygones : Institut national de l’information géographique et forestière (1)

Variables :  
- INSEE_COM : Code INSEE de la commune (1)
- NOM : Nom de la commune (1)
- POPULATION : Population de la commune (1)
- SUPERFICIE : Superficie de la commune (1)

(1) : IGN, <a href="https://geoservices.ign.fr/adminexpress"> ADMIN-EXPRESS-COG édition 2022 France entière</a>  


### Départements 2022 et régions 2022 de France métropolitaine :  

Fond de carte : Obtenu par aggrégation du jeu de données précédent (*Communes de France métropolitaine - fond voronoi*).
Variables :  
- CODEGEO : Code INSEE de l'entité (1)
- LIBGEO : Nom de l'entité (1)
- POPULATION : Population de la commune (1)
- SUPERFICIE : Superficie de la commune (1)

(1) : IGN, <a href="https://geoservices.ign.fr/adminexpress"> ADMIN-EXPRESS-COG édition 2022 France entière</a> 


### Contour France métropolitaine :

Fond de carte : Obtenu par aggrégation du jeu de données précédent (*Régions 2022 de France métropolitaine* lui-même basé sur *Communes de France métropolitaine - fond voronoi*).


### Communes de France Métropolitaine (par région) / Communes d'Outre-Mer (par département) :   

Fond de carte : Institut national de l’information géographique et forestière (1)  
Variables :  
- INSEE_COM : Code INSEE de la commune (1)
- NOM_COM : Nom de la commune (1)
- SUPERFICIE : Superficie de la commune (1)
- POPULATION : Population communale 2016 (1)
- CODE_DEPT : Code géographique du département auquel appartient la commune (1)
- NOM_DEPT : Nom du département auquel appartient la commune (1)
- CODE_REG : Code géographique de la région à laquelle appartient la commune (1)
- NOM_REG : Nom de la région à laquelle appartient la commune (1)

(1) : IGN, <a href="http://professionnels.ign.fr/geofla">GEOFLA® 2016 v2.2</a>  


### Quartiers administratifs de paris :

Fond de carte : Mairie de Paris (1)   
Variables :  
- n_sq_qu : Identifiant séquentiel du quartier (1)
- c_qu : Numéro de quartier (1)
- c_quinsee : Numéro INSEE du quartier (1)
- l_qu : Nom du quartier (1)
- c_ar : Numéro d'arrondissement (1)
- n_qu_ar : Lien avec l'arrondissement - Identifiant séquentiel (1)
- surface : Superficie du quartier en m2 (1)
- p12_pop : Population 2012 (2)
- p07_pop : Population 2007 (2)

(1) : Mairie de Paris/Direction de l'Urbanisme. Licence ODbL. Dernier traitement des données lors de la consultation : 1 janvier 2018 00:07. Consulté le 09 janvier 2018. https://opendata.paris.fr/explore/dataset/quartier_paris/information/  
(2) : Atelier Parisien d'Urbanisme / INSEE - Données statistiques de l'Insee à l'IRIS sur le territoire de la Métropole du Grand Paris (ici agrégées par quartier) - http://opendata.apur.org/datasets/iris-demographie. Consulté le 09 janvier.
