# Evreux-discover

## Présentation

Bienvenue sur Evreux-discover ! Ce projet a été réalisé dans le cadre du cours de NSI (Numérique et Sciences Informatiques) en classe de première.

### Objectif

L'objectif de ce projet est de créer une carte interactive permettant de découvrir les lieux incontournables de la ville d'Evreux, en France. Cette carte offre des informations complémentaires et détaillées sur chaque lieu, ainsi que des recoins et endroits insoupçonnés à explorer. Elle met également en avant les toilettes publiques et les points d'eau gratuits.

### Fonctionnalités

- Affichage de la carte d'Evreux avec différents fonds de cartes.
- Regroupement des marqueurs par catégorie grâce au plugin Leaflet.markercluster.
- Ajout de marqueurs sur la carte avec des popups et des liens personnalisés.
- Contrôle des couches pour afficher/masquer certains types de marqueurs.
- Affichage d'une barre latérale permettant de naviguer entre les différentes fonctionnalités de la carte.
- Possibilité d'ajouter un marqueur personnalisé sur la carte.
- Affichage des marqueurs regroupés par catégorie dans la barre latérale.
- Recherche rapide des lieux en fonction de leur catégorie.
- Affichage des informations détaillées d'un lieu lorsqu'on clique sur son marqueur.
- Affichage d'un rayon de recherche autour d'un lieu pour connaître sa portée.
- Génération de polygones isochrones pour évaluer le temps de trajet depuis un lieu donné.
- Possibilité de dessiner des formes sur la carte.
- Possibilité de localiser sa position sur la carte.
- Possibilité de basculer en mode plein écran.

## Utilisation

Pour utiliser Evreux-discover, il vous suffit d'ouvrir le fichier `index.html` dans votre navigateur. Vous pouvez alors explorer la carte interactive et découvrir les différents lieux d'Evreux.

### Barre latérale

La barre latérale est divisée en plusieurs onglets :

- L'onglet "Accueil" contient une présentation du projet et des fonctionnalités de la carte.
- L'onglet "Marqueurs" affiche la liste des marqueurs regroupés par catégorie. Vous pouvez cliquer sur une catégorie pour afficher les marqueurs correspondants sur la carte.
- L'onglet "Ajouter un marqueur" vous permet d'ajouter un marqueur personnalisé sur la carte.
- L'onglet "Crédits" affiche les crédits du projet, avec les noms des contributeurs, les sources d'icones et les plugins utilisés.

### Fonctionnalités avancées

Evreux-discover propose également des fonctionnalités avancées :

- Recherche rapide : Vous pouvez cliquer sur une catégorie dans la barre latérale pour afficher les marqueurs correspondants sur la carte.
- Rayon de recherche : Lorsque vous cliquez sur un lieu, un rayon de recherche est généré pour connaître sa portée.
- Polygones isochrones : En cliquant sur un lieu, vous pouvez générer des polygones isochrones pour évaluer le temps de trajet depuis ce lieu.
- Dessin sur la carte : Vous pouvez dessiner des formes directement sur la carte en utilisant l'outil de dessin.
- Localisation : Vous pouvez localiser votre position sur la carte en utilisant le bouton de localisation.
- Mode plein écran : Vous pouvez basculer en mode plein écran pour une meilleure expérience de navigation.

## Références

Ce projet a été réalisé en utilisant les technologies suivantes :

- Leaflet.js (version 1.9.4) : une bibliothèque JavaScript pour créer des cartes interactives.
- Leaflet.markercluster (version 1.5.3) : un plugin Leaflet pour regrouper les marqueurs sur la carte.
- Leaflet.locatecontrol (version 0.79.0) : un plugin Leaflet pour localiser sa position sur la carte.
- Leaflet.draw (version 1.0.4) : un plugin Leaflet pour dessiner sur la carte.
- leaflet.reachability (version 2.0.1) : un plugin Leaflet pour générer des polygones isochrones.
- Leaflet.Dialog : un plugin Leaflet pour afficher une boîte de dialogue personnalisée.
- leaflet-sidebar : un plugin Leaflet pour afficher une barre latérale sur la carte.
- leaflet-fullscreen : un plugin Leaflet pour basculer en mode plein écran.

Les crédits des icones utilisées dans ce projet sont disponibles dans l'onglet "Crédits" de la barre latérale.

## Contributeurs

- A. Cédric : carte interactive, intégrations des plugins, sidebar.
- C. Thomas : page d'accueil, pages explicatives.
- R. Julien : pages explicatives.
- D. Marin : recherches.
- T. Evan : recherches.
- T. Louis : recherches.

## Remerciements

Nous tenons à remercier M. Betton (professeur d'Histoire) pour ses précieuses informations sur les lieux historiques d'Evreux, ainsi que M. Maillard (professeur de NSI) pour l'inspiration de l'idée d'une carte interactive du lycée. Un grand merci également à E. Victor pour son soutien moral et ses touches d'humour pendant le développement. Enfin, nous remercions Spotify pour les bonnes playlists qui nous ont permis de rester zen pendant le codage.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier `LICENSE` pour plus d'informations.
