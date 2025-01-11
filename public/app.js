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

    // droit d'auteur
    map.attributionControl.setPrefix(false);
    map.attributionControl.addAttribution('Tous droits réservés Cédric.A 2025');

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
    const tailleIcon = getUrlParameter('tailleIcon') || 30;
    tailleIconInput.value = tailleIcon;

    document.getElementById('tailleIconForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const tailleIcon = tailleIconInput.value;
        const url = window.location.href.split('?')[0] + '?tailleIcon=' + tailleIcon;
        window.location.href = url;
    });

    //----------------Catégories de données------------------
    // création/initialisation des tableaux de marqueurs par catégorie
    var BatimentsPolygons = [];
    var SallesImportante = [];
    var info = [];
    var sport = [];
    var sportPolygons = [];
    var toilettes = [];
    var lieuxNotables = [];
    var lieux3D = [];
    // catégorie pour debug
    var markersPersonnels = [];
    var markersPersonnelsPolygons = [];

    //----------------Ajout des données (marqueurs/polygones avec les popups et liens)------------------
    // -markers de Batiments "Polygones"-
    var bat1 = L.polygon(
        [
            [49.025, 1.150],
            [49.026, 1.152],
            [49.027, 1.151],
            [49.025, 1.150]
        ],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 1'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bat 1 ici</a>').openPopup();

   BatimentsPolygons.push(bat1);

    // -markers de Salles Importante-
    SallesImportante.push(L.marker([49.02373449920583, 1.1493495595137675], {dataName: 'Salle '}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Lieux d'information-
    info.push(L.marker([49.02373449920583, 1.146], {dataName: 'Accueil'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/info.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de sport-
    sport.push(L.marker([49.02373449920583, 1.151], {dataName: 'Terrain de basket extérieur'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de sport "Polygones"-
    var PisteAthletisme = L.polygon(
        [
            [49.045, 1.140],
            [49.046, 1.142],
            [49.047, 1.141],
            [49.045, 1.140]
        ],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'piste athlétisme'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info piste athlétisme ici</a>').openPopup();

    var TerrainRugby = L.polygon(
        [
            [49.035, 1.130],
            [49.036, 1.132],
            [49.037, 1.131],
            [49.035, 1.130]
        ],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Terrain de rugby'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info Terrain de rugby ici</a>').openPopup();

   sportPolygons.push(PisteAthletisme, TerrainRugby);

    // -markers de toilettes-
    toilettes.push(L.marker([49.02373449920583, 1.151], {dataName: 'Toilettes hall (en travaux)'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de lieux Notables-
    lieuxNotables.push(L.marker([49.02373449920583, 1.151], {dataName: 'Buisson de la photo de classe'}).bindPopup('<a href="https://urlicilaaaa">lieu emblématique du lycée qui nous montre sa beauté une fois par an</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de lieux 3D-
    lieux3D.push(L.marker([49.02373449920583, 1.151], {dataName: 'vue 3d du hall (c est un exemple !)'}).bindPopup('<a href="https://urlicilaaaa">description iciiiii</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Markers personnels- (pour debug c'est ici en gros)
    markersPersonnels.push(L.marker([49.024, 1.150], {dataName: 'debug point'}).bindPopup('<a href="https://urlicilaaaa">description iciiiii</a>').setIcon(new L.Icon({iconUrl: 'icon/location_point.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de markers Personnels "Polygones"- (pour debug c'est ici aussi)
    var debugpolygon1 = L.polygon(
        [
            [49.025, 1.150],
            [49.026, 1.152],
            [49.027, 1.151],
            [49.025, 1.150]
        ],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Polygone debug' // Ajout du nom
        }
    ).bindPopup('<a href="lien_vers_la_page.html">polygon de debug</a>').openPopup();

    markersPersonnelsPolygons.push(debugpolygon1);

    //----------------Groupe reliés aux sous groupe de markers et polygones------------------
    // création des groupes de couches à partir des tableaux de marqueurs (ajouter ici si ajout de catégories de markers !)
    var BatimentsLayer = L.layerGroup([...BatimentsPolygons]);
    var SallesImportanteLayer = L.layerGroup([...SallesImportante]);
    var infoLayer = L.layerGroup([...info]);
    var sportLayer = L.layerGroup([...sport, ...sportPolygons]);
    var toilettesLayer = L.layerGroup([...toilettes]);
    var lieuxNotablesLayer = L.layerGroup([...lieuxNotables]);
    var lieux3DLayer = L.layerGroup([...lieux3D]);
    //debug layer
    var markersPersonnelsLayer = L.layerGroup([...markersPersonnels, ...markersPersonnelsPolygons]);

    // ajout des groupes de couches à overlayMaps
    var overlayMaps = {
        "<span style='color: DarkSlateGray'>Batiments 3d</span>": osmb,
        "<span style='color: olive'>Toponymes</span>": toponymes,
        "Batiments": BatimentsLayer,
        "Salles importantes": SallesImportanteLayer,
        "Lieux d'informations": infoLayer,
        "Sports": sportLayer,
        "Toilettes": toilettesLayer,
        "Lieux notables": lieuxNotablesLayer,
        "Lieux 3D": lieux3DLayer,
        //debug
        "(debug)": markersPersonnelsLayer,
    };
    // affichage de tout les markers de base
    map.addLayer(BatimentsLayer);
    map.addLayer(SallesImportanteLayer);
    map.addLayer(infoLayer);
    map.addLayer(sportLayer);
    map.addLayer(toilettesLayer);
    map.addLayer(lieuxNotablesLayer);
    map.addLayer(lieux3DLayer)

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

    //----------------Plugin localisation + Notifications------------------
    // Initialisation des notifications
    var notification = L.control
    .notifications({
        timeout: 5000, // Durée d'affichage par défaut
        position: 'topright', // Position des notifications
        closable: true, // Permettre de fermer manuellement
        dismissable: true, // Permet de cliquer pour fermer
    })
    .addTo(map);

    // Variables pour suivre l'état de la localisation
    var lastAccuracyState = null; // Dernier état de précision (suffisante ou insuffisante)

    // Fonction pour afficher une notification
    function showNotification(type, title, message, recurringKey = null) {
    var notificationKey = title + message;

    // Vérifier si la notification est déjà active
    if (activeNotifications.includes(notificationKey)) {
        return; // Ne pas afficher si le même message est déjà affiché
    }

    activeNotifications.push(notificationKey);

    // Afficher la notification
    switch (type) {
        case 'alert':
            notification.alert(title, message);
            break;
        case 'info':
            notification.info(title, message);
            break;
        case 'success':
            notification.success(title, message);
            break;
        case 'warning':
            notification.warning(title, message);
            break;
        default:
            console.warn('Type de notification inconnu :', type);
    }

    // Retirer la notification de la liste active après 5 secondes
    setTimeout(function () {
        activeNotifications = activeNotifications.filter(function (key) {
            return key !== notificationKey;
        });
    }, 5000); // Durée de la notification (5000 ms = 5 secondes)
    }

    // Ajouter un contrôle de localisation
    var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: 'Localiser ma position'
    },
    drawCircle: true,
    drawMarker: true,
    follow: true,
    setView: 'untilPanOrZoom',
    keepCurrentZoomLevel: false,
    stopFollowingOnDrag: false,
    metric: true,
    icon: 'fa fa-location-arrow',
    iconLoading: 'fa fa-spinner fa-spin',
    circleStyle: {
        color: '#136AEC',
        fillColor: '#136AEC',
        fillOpacity: 0.2,
        weight: 1
    },
    markerStyle: {
        color: '#136AEC',
        fillColor: '#136AEC',
        fillOpacity: 0.8,
        weight: 1
    },
    followCircleStyle: {
        color: '#136AEC',
        fillColor: '#136AEC',
        fillOpacity: 0.4,
        weight: 1
    },
    followMarkerStyle: {
        color: '#136AEC',
        fillColor: '#136AEC',
        fillOpacity: 0.8,
        weight: 1
    },
    circlePadding: [0, 0],
    locateOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
    }
    }).addTo(map);

    // Gérer l'événement `locationfound` pour vérifier la précision
    map.on('locationfound', function (e) {
    var accuracy = e.accuracy; // Précision en mètres
    var newAccuracyState = (accuracy <= 100) ? 'sufficient' : 'insufficient'; // Etat actuel de la précision

    // Si l'état de précision a changé (passage de suffisant à insuffisant ou vice-versa)
    if (newAccuracyState !== lastAccuracyState) {
        // Si la précision est insuffisante, afficher l'alerte
        if (newAccuracyState === 'insufficient') {
            showNotification(
                'alert',
                'Précision insuffisante',
                `La précision de votre localisation est de ${Math.round(accuracy)} mètres. 
                Veuillez activer la localisation précise dans vos paramètres ou désactiver la localisation.`
            );
        } 
        // Si la précision devient suffisante, afficher le message de localisation réussie
        else if (newAccuracyState === 'sufficient') {
            showNotification('success', 'Localisation réussie', 'La précision de votre localisation est acceptable.');
        }

        // Mettre à jour l'état de la précision
        lastAccuracyState = newAccuracyState;
    }
    });

    // Gérer les erreurs de localisation
    map.on('locationerror', function (e) {
    showNotification('warning', 'Erreur de localisation', 'Impossible de localiser votre position : ' + e.message);

    // Réinitialiser l'état de la précision à null pour permettre de réafficher le message d'erreur plus tard
    lastAccuracyState = null;
    });

    // Démarrez la localisation automatiquement au chargement de la page
    lc.start();

    //----------------Plugin sidebar------------------
    var sidebar = L.control.sidebar('sidebar', {position: 'left'}).addTo(map);

    //~~~Menu listes markers~~~
    // definitions des marqueurs par catégorie à l'aide des icônes
    const markersByCategory = {
        "Batiments": { layer: BatimentsLayer, icon: 'icon/batiment.png' },
        "Salles importantes": { layer: SallesImportanteLayer, icon: 'icon/pin.png' },
        "infos": { layer: infoLayer, icon: 'icon/info.png' },
        "Sports": { layer: sportLayer, icon: 'icon/sport.png' },
        "Toilettes": { layer: toilettesLayer, icon: 'icon/toilettes.png' },
        "Lieux notables": { layer: lieuxNotablesLayer, icon: 'icon/star.png' },
        "Lieux 3D": { layer: lieux3DLayer, icon: 'icon/3d.png' },
        //debug
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
    
                // ajouts de la liste de markers/polygones
                const markersList = document.createElement('ul');
                markersList.classList.add('markers-list');
                markersByCategory[category].layer.getLayers().forEach(layer => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('marker-item');
                    if (layer.options.dataName) {
                        listItem.textContent = layer.options.dataName;
                        if (layer instanceof L.Marker) {
                            listItem.addEventListener('click', () => map.setView(layer.getLatLng(), 18));
                        } else if (layer instanceof L.Polygon) {
                            listItem.addEventListener('click', () => map.fitBounds(layer.getBounds()));
                        }
                    } else {
                        listItem.textContent = "Polygone";
                        if (layer instanceof L.Polygon) {
                            listItem.addEventListener('click', () => map.fitBounds(layer.getBounds()));
                        }
                    }
                    markersList.appendChild(listItem);
                });
                categoryDiv.appendChild(markersList);
            }
        }
    }    
});
