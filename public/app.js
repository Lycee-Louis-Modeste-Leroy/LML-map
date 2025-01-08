document.addEventListener("DOMContentLoaded", function () {
    //----------------Fonds de cartes------------------
    // Création de la carte
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'});

    var Satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'ArcGIS'});
    
    var otp = L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        maxNativeZoom: 17,
        attribution: 'Kartendaten: © OpenStreetMap-Mitwirkende, SRTM Kartendarstellung: © OpenTopoMap (CC-BY-SA)'});
    
    const map = L.map('map', {layers: [Satellite]}).setView([49.02188501857289, 1.165796267840064], 17);
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Carte de fond OpenStreetMap
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'ArcGIS'}).addTo(map);
       
    var baseMaps = {
        "Satellite": Satellite,
        "OpenStreetMap": osm,
        "OpenTopoMap": otp,
    };

    // création de la couche des toponymes
    var toponymes = new L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.{ext}?api_key=7941eff7-366c-48c1-a60d-cf353be4aa97', {
        minZoom: 0,
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png',
    });

    // Ajout de la couche OSMBuildings
    var osmb = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');

    //----------------Markers/Points sur la carte et données d'informations------------------
    // création d'un groupes de marqueurs
    const markers = L.layerGroup();

    // récupération de la taille de l'icône à partir de l'URL du client
    function getUrlParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const tailleIconInput = document.getElementById('tailleIconInput');
    const tailleIcon = getUrlParameter('tailleIcon') || 18;
    tailleIconInput.value = tailleIcon;

    document.getElementById('tailleIconForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const tailleIcon = tailleIconInput.value;
        const url = window.location.href.split('?')[0] + '?tailleIcon=' + tailleIcon;
        window.location.href = url;
    });

    // création/initialisation des tableaux de marqueurs par catégorie
    var lieux3D = [];
    var infoPlace = [];
    var sportPlace = [];
    var toilettesPlace = [];
    var markersPersonnels = [];

    // Ajout des marqueurs avec les popups et liens
    // -markers de lieux 3D-
    lieux3D.push(L.marker([49.02475043512676, 1.1662588992127314], {dataName: '3D Usine Nétreville Philips (tunnel)'}).bindPopup('<a href="gaussian_splatting/urbex_usine_netreville/tunnel/index.html">3D Usine Nétreville Philips (tunnel)</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));
    lieux3D.push(L.marker([49.0253145910712, 1.1656430126264936], {dataName: '3D Usine Nétreville Philips (chemin)'}).bindPopup('<a href="gaussian_splatting/urbex_usine_netreville/chemin/index.html">3D Usine Nétreville Philips (chemin)</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));
    lieux3D.push(L.marker([49.02646565678856, 1.1512659263095817], {dataName: '3D Place de la mairie et théatre'}).bindPopup('<a href="gaussian_splatting/mairie/place/index.html">3D Place de la mairie et théatre</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Lieux d'information-
    infoPlace.push(L.marker([49.02373449920583, 1.1493495595137675], {dataName: 'Office du tourisme evreux'}).bindPopup('<a href="http://www.lecomptoirdesloisirs-evreux.fr/">Office du tourisme evreux</a>').setIcon(new L.Icon({iconUrl: 'icon/info.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Sports/J.O 2024-
    sportPlace.push(L.marker([49.0221629331427, 1.1273308731985334], {dataName: 'Piscine Jean Bouin'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Piscine Jean Bouin</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    
    // -markers de Toilettes publiques-
    toilettesPlace.push(L.marker([49.020380367794814, 1.1493014814471363], {dataName: 'Toilettes public jardin public'}).bindPopup('<a href="#">Toilettes public jardin public</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Markers personnels- (pour debug c'est ici en gros)

    // création des groupes de couches à partir des tableaux de marqueurs (ajouter ici si ajout de catégories de markers !)
    var lieux3DLayer = L.layerGroup(lieux3D);
    var infoPlaceLayer = L.layerGroup(infoPlace);
    var sportPlaceLayer = L.layerGroup(sportPlace);
    var toilettesPlaceLayer = L.layerGroup(toilettesPlace);
    var markersPersonnelsLayer = L.layerGroup(markersPersonnels);

    // ajout des groupes de couches à overlayMaps
    var overlayMaps = {
        "<span style='color: DarkSlateGray'>Batiments 3d</span>": osmb,
        "<span style='color: olive'>Toponymes</span>": toponymes,
        "Lieux d'information" : infoPlaceLayer,
        "Sports" : sportPlaceLayer,
        "Toilettes publiques" : toilettesPlaceLayer,
        "Lieux 3D" : lieux3DLayer,
        "Markers personnels" : markersPersonnelsLayer,
    };
    // affichage de tout les markers de base
    map.addLayer(lieux3DLayer);
    map.addLayer(infoPlaceLayer);
    map.addLayer(sportPlaceLayer);
    map.addLayer(toilettesPlaceLayer);
    map.addLayer(markersPersonnelsLayer);

    // ajouts des groupes de marqueurs à la carte
    map.addLayer(markers);

    // ajout du contrôle des couches de markers à la carte
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    //----------------Plugin boxmessage------------------
    // Après avoir config les couches de la carte, ajoutez la fenêtre avec le code la :
    //var contents = [
        //"<h1>Bonjour et bienvenue !</h1>",
        //"<p></p>",
        //"<h2>Explorez la carte interactive</h2>",
        //"<h3>vous y trouverez:</h3>",
        //"<p>-les lieux incontournables d'Evreux</p>",
        //"<p>-des informations complémentaires et détaillées</p>",
        //"<p>-des recoins/endroit insoupçonné et unique</p>",
        //"<p>-surtout les toilettes et points d'eau gratuits</p>",
        //].join('');
    
    //var dialog = L.control.dialog({ size: [ 350, 350 ], minSize: [ 100, 100 ], maxSize: [ 500, 500 ], anchor: [ 250, 250 ], position: "topleft", initOpen: true }).setContent(contents).addTo(map);

    //----------------Plugin fullscreen------------------
    // fullscreen un beu buggé mais pas le temps de faire mieux, si idées, modifier le code!!!
    map.addControl(new L.Control.Fullscreen({
        title: {
            'false': 'Basculer en plein écran',
            'true': 'Quitter le plein écran'
        }
    }));

    //----------------Plugin localisation------------------
    // création d'un contrôle de localisation
    var lc = L.control.locate({
        position: 'topleft', // Position du contrôle
        strings: {
            title: 'Localiser ma position' // Texte du titre
        },
        drawCircle: true, // Dessiner un cercle autour de la position
        drawMarker: true, // Dessiner un marqueur à la position
        follow: true, // Suivre la position de l'utilisateur
        setView: 'untilPanOrZoom', // Centrer la carte sur la position
        keepCurrentZoomLevel: false, // Ne pas conserver le niveau de zoom actuel
        stopFollowingOnDrag: false, // Ne pas arrêter le suivi lors du glissement de la carte
        metric: true, // Utiliser les unités métriques
        icon: 'fa fa-location-arrow', // Icône personnalisée
        iconLoading: 'fa fa-spinner fa-spin', // Icône de chargement
        circleStyle: { // Style du cercle
            color: '#136AEC',
            fillColor: '#136AEC',
            fillOpacity: 0.2,
            weight: 1
        },
        markerStyle: { // Style du marqueur
            color: '#136AEC',
            fillColor: '#136AEC',
            fillOpacity: 0.8,
            weight: 1
        },
        followCircleStyle: { // Style du cercle lors du suivi
            color: '#136AEC',
            fillColor: '#136AEC',
            fillOpacity: 0.4,
            weight: 1
        },
        followMarkerStyle: { // Style du marqueur lors du suivi
            color: '#136AEC',
            fillColor: '#136AEC',
            fillOpacity: 0.8,
            weight: 1
        },
        circlePadding: [0, 0], // Espacement autour du cercle
        locateOptions: { // Options de localisation
            enableHighAccuracy: true, // Activer la haute précision
            maximumAge: 0, // Ne pas utiliser de position mise en cache
            timeout: 10000 // Délai d'attente de 10 secondes
        }
    }).addTo(map);

    // Démarrez la localisation automatiquement lors du chargement de la page
    lc.start();


    //----------------Plugin sidebar------------------
    var sidebar = L.control.sidebar('sidebar', {position: 'left'}).addTo(map);

    //~~~Menu listes markers~~~
    // definitions des marqueurs par catégorie à l'aide des icônes
    const markersByCategory = {
        "Models 3D de lieux": { layer: lieux3DLayer, icon: 'icon/3d.png' },
        "Lieux d'information": { layer: infoPlaceLayer, icon: 'icon/info.png' },
        "Sports": { layer: sportPlaceLayer, icon: 'icon/sport.png' },
        "Toilettes publiques": { layer: toilettesPlaceLayer, icon: 'icon/toilettes.png' },
        "Markers personnels": { layer: markersPersonnelsLayer, icon: 'icon/location_point.png' },
    };
  
    // creation du menu de markers
    createMarkerMenu(markersByCategory);
    
    function createMarkerMenu(markersByCategory) {
        const markerMenu = document.getElementById('markers');
        markerMenu.innerHTML = '';
        for (const category in markersByCategory) {
        if (markersByCategory.hasOwnProperty(category)) {
            const categoryDiv = document.createElement('details');
            categoryDiv.innerHTML = `<summary><img src="${markersByCategory[category].icon}" width="16" height="16" style="vertical-align: middle;"> ${category}</summary>`;
            categoryDiv.classList.add('category');
            markerMenu.appendChild(categoryDiv);
    
            const categoryLink = categoryDiv.querySelector('summary');
            categoryLink.href = '#';
            categoryLink.addEventListener('click', function () {
            map.addLayer(markersByCategory[category].layer);
            });
    
            const nbMarkers = markersByCategory[category].layer.getLayers().length;
            categoryLink.dataset.nbMarkers = nbMarkers;
            const span = document.createElement('span');
            span.classList.add('category-count');
            span.textContent = ` (${nbMarkers})`;
            categoryLink.appendChild(span);
    
            // ajouts de la liste de markers
            const markersList = document.createElement('ul');
            markersList.classList.add('markers-list');
            for (const marker of markersByCategory[category].layer.getLayers()) {
            const listItem = document.createElement('li');
            listItem.classList.add('marker-item');
            listItem.textContent = marker.options.dataName;
            listItem.addEventListener('click', function () {
                map.setView(marker.getLatLng(), 18);
            });
            markersList.appendChild(listItem);
            }
            categoryDiv.appendChild(markersList);
        }
        }
    }
});
