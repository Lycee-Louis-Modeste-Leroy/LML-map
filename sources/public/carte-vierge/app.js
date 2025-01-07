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
    
    const map = L.map('map', {layers: [Satellite]}).setView([46,2], 6);
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Carte de fond OpenStreetMap
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'ArcGIS'}).addTo(map);
       
    var baseMaps = {
        "Satellite": Satellite,
        "OpenStreetMap": osm,
        "OpenTopoMap": otp,
    };

    // création de la couche des chemins
    var lines = new L.TileLayer("http://gps-{s}.tile.openstreetmap.org/lines/{z}/{x}/{y}.png");

    // création de la couche des temperatures
    var temperature = new L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Land_Surface_Temp_Day/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 7,
        format: 'png',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level',
        opacity: 0.75
    });

    // création de la couche de neige
    var neige = new L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_NDSI_Snow_Cover/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 7,
        format: 'png',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level',
        opacity: 0.75
    });

    // création de la couche des toponymes
    var toponymes = new L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.{ext}?api_key=7941eff7-366c-48c1-a60d-cf353be4aa97', {
        minZoom: 0,
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png',
    });

    // création de la couche des batiments 3d
    var batiments3d = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
    map.removeLayer(batiments3d);

    //----------------Markers/Points sur la carte et données d'informations------------------
    // création d'un groupes de marqueurs
    const markers = L.layerGroup();

    // récupération de la taille de l'icône à partir de l'URL du client
    function getUrlParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const tailleIconInput = document.getElementById('tailleIconInput');
    const tailleIcon = getUrlParameter('tailleIcon') || 45;
    tailleIconInput.value = tailleIcon;

    document.getElementById('tailleIconForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const tailleIcon = tailleIconInput.value;
        const url = window.location.href.split('?')[0] + '?tailleIcon=' + tailleIcon;
        window.location.href = url;
    });

    // création/initialisation des tableaux de marqueurs par catégorie
    var lieux3D = [];
    var artPlace = [];
    var eauPlace = [];
    var historiquePlace = [];
    var infoPlace = [];
    var jardinPlace = [];
    var jumellesPlace = [];
    var mairiePlace = [];
    var maisonPlace = [];
    var sentierPlace = [];
    var sportPlace = [];
    var theatrePlace = [];
    var toilettesPlace = [];
    var markersPersonnels = [];
    var CheminsPersonnels = [];

    // -markers de Markers personnels- (pour debug c'est ici en gros)

    // création des groupes de couches à partir des tableaux de marqueurs (ajouter ici si ajout de catégories de markers !)
    var lieux3DLayer = L.layerGroup(lieux3D);
    var artPlaceLayer = L.layerGroup(artPlace);
    var eauPlaceLayer = L.layerGroup(eauPlace);
    var historiquePlaceLayer = L.layerGroup(historiquePlace);
    var infoPlaceLayer = L.layerGroup(infoPlace);
    var jardinPlaceLayer = L.layerGroup(jardinPlace);
    var jumellesPlaceLayer = L.layerGroup(jumellesPlace);
    var mairiePlaceLayer = L.layerGroup(mairiePlace);
    var maisonPlaceLayer = L.layerGroup(maisonPlace);
    var sentierPlaceLayer = L.layerGroup(sentierPlace);
    var sportPlaceLayer = L.layerGroup(sportPlace);
    var theatrePlaceLayer = L.layerGroup(theatrePlace);
    var toilettesPlaceLayer = L.layerGroup(toilettesPlace);
    var markersPersonnelsLayer = L.layerGroup(markersPersonnels);
    var CheminsPersonnelsLayer = L.layerGroup(CheminsPersonnels);

    // ajout des groupes de couches à overlayMaps
    var overlayMaps = {
        "<span style='color: olive'>Batiments 3d</span>": batiments3d,
        "<span style='color: sienna'>Chemins</span>": lines,
        "<span style='color: olive'>Toponymes</span>": toponymes,
        "<span style='color: gold'>Températures</span>": temperature,
        "<span style='color: rosyBrown'>Neige</span>": neige,
        "Models 3D de lieux" : lieux3DLayer,
        "Lieux d'art" : artPlaceLayer,
        "Points d'eau" : eauPlaceLayer,
        "Lieux historique" : historiquePlaceLayer,
        "Lieux d'information" : infoPlaceLayer,
        "Jardin" : jardinPlaceLayer,
        "Point de vue" : jumellesPlaceLayer,
        "Mairie" : mairiePlaceLayer,
        "Urbex/Désaffecté" : maisonPlaceLayer,
        "Chemins/Parcours sportifs" : sentierPlaceLayer,
        "Sports/J.O 2024" : sportPlaceLayer,
        "Lieux culturels" : theatrePlaceLayer,
        "Toilettes publiques" : toilettesPlaceLayer,
        "Markers personnels" : markersPersonnelsLayer,
        "Chemins personnels (geojson)" : CheminsPersonnelsLayer,
    };
    // affichage de tout les markers de base
    map.addLayer(lieux3DLayer);
    map.addLayer(artPlaceLayer);
    map.addLayer(eauPlaceLayer);
    map.addLayer(historiquePlaceLayer);
    map.addLayer(infoPlaceLayer);
    map.addLayer(jardinPlaceLayer);
    map.addLayer(jumellesPlaceLayer);
    map.addLayer(mairiePlaceLayer);
    map.addLayer(maisonPlaceLayer);
    map.addLayer(sentierPlaceLayer);
    map.addLayer(sportPlaceLayer);
    map.addLayer(theatrePlaceLayer);
    map.addLayer(toilettesPlaceLayer);
    map.addLayer(markersPersonnelsLayer);
    map.addLayer(CheminsPersonnelsLayer);

    // ajouts des groupes de marqueurs à la carte
    map.addLayer(markers);

    // ajout du contrôle des couches de markers à la carte
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    //----------------Plugin boxmessage------------------
    // Après avoir config les couches de la carte, ajoutez la fenêtre avec le code la :
    var contents = [
        "<h1>Bonjour et bienvenue !</h1>",
        "<p></p>",
        "<h2>Explorez la carte interactive</h2>",
        "<h3>vous y trouverez des outils pour:</h3>",
        "<p>-visualiser les batiments en 3d</p>",
        "<p>-visualiser les températures/neiges</p>",
        "<p>-calculer une aire</p>",
        "<p>-ajouter des markers à la carte</p>",
        "<p>-ajouter des chemins (fichier .geojson)</p>",
        "<p>-visualiser les points deja créer</p>",
        "<p>-vous localisez</p>",
        "<p>-choisir le fond de carte</p>",
        "<p>-changer la taille des icons</p>",
        ].join('');
    
    var dialog = L.control.dialog({ size: [ 350, 400 ], minSize: [ 100, 100 ], maxSize: [ 500, 500 ], anchor: [ 250, 250 ], position: "topleft", initOpen: true }).setContent(contents).addTo(map);

    //----------------Plugin fullscreen------------------
    // fullscreen un beu buggé mais pas le temps de faire mieux, si idées, modifier le code!!!
    map.addControl(new L.Control.Fullscreen({
        title: {
            'false': 'Basculer en plein écran',
            'true': 'Quitter le plein écran'
        }
    }));

    //----------------Systeme de dessin sur la carte------------------
    // Création d'une couche de dessin
    var drawnItems = new L.FeatureGroup();
     map.addLayer(drawnItems);

    // Création d'un contrôle de dessin
    const drawControl = new L.Control.Draw({
        position: 'topright',
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

     // ajout des formes pour dessinées à la couche de dessins
    map.on(L.Draw.Event.CREATED, function (e) {
        drawnItems.addLayer(e.layer);
    });

    // création d'un contrôle de localisation
    L.control.locate({
        position: 'topleft',
        strings: {
            title: 'Localiser ma position'
        }
    }).addTo(map);

    //----------------Rayon génération pour le deplacement information------------------
    function styleIsolines(feature) {
        return {
            color: '#00d1d4',
            opacity: 0.5,
            fillOpacity: 0.2
        };
    }

    function highlightIsolines(e) {
        var layer = e.target;

        layer.setStyle({
            fillColor: '#ffea00',
            dashArray: '1,13',
            weight: 4,
            fillOpacity: '0.5',
            opacity: '1'
        });
    }

    function resetIsolines(e) {
        var layer = e.target;

        reachabilityControl.isolinesGroup.resetStyle(layer);
    }

    function clickIsolines(e) {
        var layer = e.target;
        var props = layer.feature.properties;
        var popupContent = 'Mode de déplacement: ' + props['Travel mode'] + '<br />Portée: 0 - ' + props['Range'] + ' ' + props['Range units'] + '<br />Zone: ' + props['Area'] + ' ' + props['Area units'] + '<br />Population: ' + props['Population'];
        if (props.hasOwnProperty('Reach factor')) popupContent += '<br />Facteur de portée: ' + props['Reach factor'];
        layer.bindPopup(popupContent).openPopup();
    }

    function isolinesOrigin(latLng, travelMode, rangeType) {
        return L.circleMarker(latLng, { radius: 4, weight: 2, color: '#0073d4', fillColor: '#fff', fillOpacity: 1 });
    }

    // ajouter le plugin reachability
    var reachabilityControl = L.control.reachability({
        apiKey: '5b3ce3597851110001cf6248ef1e60cbe9394a469697004d368c1915', // NE PAS CHANGER LA CLE D'API !!!
        styleFn: styleIsolines,
        mouseOverFn: highlightIsolines,
        mouseOutFn: resetIsolines,
        clickFn: clickIsolines,
        markerFn: isolinesOrigin,
        expandButtonContent: '',
        expandButtonStyleClass: 'reachability-control-expand-button fa fa-bullseye',
        collapseButtonContent: '',
        collapseButtonStyleClass: 'reachability-control-collapse-button fa fa-caret-up',
        drawButtonContent: '',
        drawButtonStyleClass: 'fa fa-pencil',
        deleteButtonContent: '',
        deleteButtonStyleClass: 'fa fa-trash',
        distanceButtonContent: '',
        distanceButtonStyleClass: 'fa fa-road',
        timeButtonContent: '',
        timeButtonStyleClass: 'fa fa-clock-o',
        travelModeButton1Content: '',
        travelModeButton1StyleClass: 'fa fa-car',
        travelModeButton2Content: '',
        travelModeButton2StyleClass: 'fa fa-bicycle',
        travelModeButton3Content: '',
        travelModeButton3StyleClass: 'fa fa-male',
        travelModeButton4Content: '',
        travelModeButton4StyleClass: 'fa fa-wheelchair-alt'
    }).addTo(map);

    // si ya une erreur :
    map.on('reachability:error', function () {
        alert('Malheureusement, une erreur s`est produite lors de l`appel de l`API.\nPlus de détails sont disponibles dans la console pour le nerd.');
    });

    map.on('reachability:no_data', function () {
        alert('Malheureusement, aucune donnée n`a été reçue de l`API.\n');
    });

    //----------------Plugin sidebar------------------
    var sidebar = L.control.sidebar('sidebar', {position: 'left'}).addTo(map);

    //~~~Menu listes markers~~~
    // definitions des marqueurs par catégorie à l'aide des icônes
    const markersByCategory = {
        "Models 3D de lieux": { layer: lieux3DLayer, icon: 'icon/3d.png' },
        "Lieux d'art": { layer: artPlaceLayer, icon: 'icon/art.png' },
        "Points d'eau": { layer: eauPlaceLayer, icon: 'icon/eau.png' },
        "Lieux historique": { layer: historiquePlaceLayer, icon: 'icon/historique.png' },
        "Lieux d'information": { layer: infoPlaceLayer, icon: 'icon/info.png' },
        "Jardin": { layer: jardinPlaceLayer, icon: 'icon/jardin.png' },
        "Point de vue": { layer: jumellesPlaceLayer, icon: 'icon/jumelles.png' },
        "Mairie": { layer: mairiePlaceLayer, icon: 'icon/mairie.png' },
        "Urbex/Désaffecté": { layer: maisonPlaceLayer, icon: 'icon/maison.png' },
        "Chemins/Parcours sportifs": { layer: sentierPlaceLayer, icon: 'icon/sentier.png' },
        "Sports/J.O 2024": { layer: sportPlaceLayer, icon: 'icon/sport.png' },
        "Lieux culturels": { layer: theatrePlaceLayer, icon: 'icon/theatre.png' },
        "Toilettes publiques": { layer: toilettesPlaceLayer, icon: 'icon/toilettes.png' },
        "Markers personnels": { layer: markersPersonnelsLayer, icon: 'icon/location_point.png' },
        "Chemins personnels (geojson)": { layer: CheminsPersonnelsLayer, icon: 'icon/location_chemin.png' },
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

    //~~~Menu ajouts markers~~~
    function areFormFieldsFilled() {
        var iconSelect = document.getElementById('iconSelect');
        var coordinatesInput = document.getElementById('coordinates');
        var dataNameInput = document.getElementById('dataName');
      
        if (iconSelect.value === '' || coordinatesInput.value === '' || dataNameInput.value === '') {
          alert('Veuillez remplir tous les champs obligatoires avant de rajouter un marqueur personnalisé.');
          return false;
        }
        return true;
      }
    
    // ajouter d'un événements pour recupérer les infos pour le formulaire
    document.getElementById('addMarkerForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        if (!areFormFieldsFilled()) {
        return;
        }
    
        var iconSelect = document.getElementById('iconSelect');
        var coordinatesInput = document.getElementById('coordinates');
        var dataNameInput = document.getElementById('dataName');
        var popupTextInput = document.getElementById('popupText');
        var popupUrlInput = document.getElementById('popupUrl');
    
        var icon = iconSelect.value;
        var coordinates = coordinatesInput.value.split(',');
        var dataName = dataNameInput.value;
        var popupText = popupTextInput.value;
        var popupUrl = popupUrlInput.value;
    
        // créer un nouveau marqueur avec les valeurs
        var marker = L.marker(coordinates, {
        icon: new L.Icon({
            iconUrl: icon,
            iconSize: [tailleIcon, tailleIcon]
        }),
        dataName: dataName
        });
    
        marker.bindPopup('<a href="' + popupUrl + '">' + popupText + '</a>');
    
        markersPersonnels.push(marker);
    
        markers.addLayer(marker);
        markersPersonnelsLayer.addLayer(marker);
    
        // mise à jour de la listes des markers
        createMarkerMenu(markersByCategory);
    
        // reset du formulaire
        coordinatesInput.value = '';
        dataNameInput.value = '';
        popupTextInput.value = '';
        popupUrlInput.value = '';
    });
    
    // prévisualisation de l'icône
    const iconPreview = document.getElementById("iconPreview");

    document.getElementById("iconSelect").addEventListener("change", () => {
    // récupérez l'URL de l'icône sélectionnée
    const iconUrl = document.getElementById("iconSelect").value;
    
    // mise à jour de l'arrière-plan de l'élément avec l'URL de l'icône
    iconPreview.style.backgroundImage = `url(${iconUrl})`;
    });

    // afficher l'icône par défaut
    document.getElementById("iconSelect").dispatchEvent(new Event("change"));

    //~~~Menu ajouts chemin~~~
    function importGeoJsonFile(file) {
        clearGeoJson();
      
        const reader = new FileReader();
        reader.onload = function (event) {
          const geoJsonData = JSON.parse(event.target.result);
          const geoJsonLayer = L.geoJSON(geoJsonData, {
            onEachFeature: function (feature, layer) {
              const layerName = document.getElementById("geoJsonFileNameInput").value;
              layer.options.dataName = layerName;
              CheminsPersonnels.push(layer);
              CheminsPersonnelsLayer.addLayer(layer);
            }
          });
          map.addLayer(geoJsonLayer);
          // mise à jour de la listes des markers (encore)
          createMarkerMenu(markersByCategory);
        };
        reader.readAsText(file);
      }
    
    document.getElementById("importGeoJsonButton").addEventListener("click", () => {
    const inputElement = document.getElementById("geoJsonFileInput");
    if (inputElement.files.length > 0) {
        const file = inputElement.files[0];
        importGeoJsonFile(file);
        inputElement.value = "";
    }
    });

    // prévisualisation du fichier GeoJSON
    function displayGeoJsonPreview(geoJson) {
        const previewContainer = document.getElementById('geoJsonPreview');
        previewContainer.innerHTML = '';
        const features = geoJson.features;
        if (features && features.length > 0) {
            features.forEach(feature => {
                const type = feature.geometry.type;
                if (type === 'Point') {
                    const coordinates = feature.geometry.coordinates;
                    addMarkerToMapPreview(coordinates[1], coordinates[0], feature.properties.name);
                } else if (type === 'LineString' || type === 'Polygon') {
                    addGeoJsonToMapPreview(feature);
                }
            });
        } else {
            const noFeaturesPreview = document.createElement('p');
            noFeaturesPreview.textContent = 'Aucune fonctionnalité trouvée dans le fichier GeoJSON.';
            previewContainer.appendChild(noFeaturesPreview);
        }
    }

    // reset le fichier GeoJSON actuel chargé
    function clearGeoJson() {
        document.getElementById('geoJsonFileInput').value = '';
        document.getElementById('geoJsonPreview').innerHTML = '';
        document.getElementById('mapPreview').innerHTML = '';
        if (mapPreview._leaflet) {
            mapPreview._leaflet.remove();
            mapPreview._leaflet = null;
        }
    }

    // événement changement de fichier GeoJSON
    document.getElementById('geoJsonFileInput').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const geoJson = JSON.parse(reader.result);
                displayGeoJsonPreview(geoJson);
            };
            reader.readAsText(file);
        } else {
            clearGeoJson();
        }
    });

    // bouton reset du fichier GeoJSON
    document.getElementById('clearGeoJsonButton').addEventListener('click', clearGeoJson);
        
    // ajouter un marqueur à la carte de prévisualisation
    // (sa fonctionne quand le sens du vent le veut, a revoir si possible)
    function addMarkerToMapPreview(lat, lng, title) {
        const mapPreview = document.getElementById('mapPreview')
        if (!mapPreview._leaflet) {
          mapPreview._leaflet = L.map(mapPreview).setView([lat, lng], 13)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapPreview._leaflet)
        }
        L.marker([lat, lng]).addTo(mapPreview._leaflet).bindPopup(title)
      }
    
    // ajouter une couche GeoJSON à la carte de prévisualisation
    function addGeoJsonToMapPreview(feature) {
        const mapPreview = document.getElementById('mapPreview')
        if (!mapPreview._leaflet) {
          mapPreview._leaflet = L.map(mapPreview).setView([feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]], 13)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapPreview._leaflet)
        }
        L.geoJSON(feature).addTo(mapPreview._leaflet)
      }
    
    // événement de changement du fichier GeoJSON
    document.getElementById('geoJsonFileInput').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const geoJson = JSON.parse(reader.result);
            displayGeoJsonPreview(geoJson);
        };
        reader.readAsText(file);
        } else {
        clearGeoJson();
        }
    });
    
    // bouton reset du fichier GeoJSON
    document.getElementById('clearGeoJsonButton').addEventListener('click', clearGeoJson);
});
