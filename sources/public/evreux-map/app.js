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
    
    const map = L.map('map', {layers: [Satellite]}).setView([49.01977957460211,1.1655593991722224], 14);
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

    // création de la couche des pistes de skis
    var pistedeski = new L.tileLayer('https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png', {
        minZoom: 9,
        maxZoom: 18,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & ODbL, &copy; <a href="https://www.opensnowmap.org/iframes/data.html">www.opensnowmap.org</a> <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

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

    // Ajout des marqueurs avec les popups et liens
    // -markers de lieux 3D-
    lieux3D.push(L.marker([49.02475043512676, 1.1662588992127314], {dataName: '3D Usine Nétreville Philips (tunnel)'}).bindPopup('<a href="gaussian_splatting/urbex_usine_netreville/tunnel/index.html">3D Usine Nétreville Philips (tunnel)</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));
    lieux3D.push(L.marker([49.0253145910712, 1.1656430126264936], {dataName: '3D Usine Nétreville Philips (chemin)'}).bindPopup('<a href="gaussian_splatting/urbex_usine_netreville/chemin/index.html">3D Usine Nétreville Philips (chemin)</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));
    lieux3D.push(L.marker([49.02646565678856, 1.1512659263095817], {dataName: '3D Place de la mairie et théatre'}).bindPopup('<a href="gaussian_splatting/mairie/place/index.html">3D Place de la mairie et théatre</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Lieux d'art-
    artPlace.push(L.marker([49.02383961632773, 1.1509063835677622], {dataName: 'Musée d`Art, Histoire et Archéologie'}).bindPopup('<a href="https://evreux.fr/sortir/culture/musee-evreux/">Musée d`Art, Histoire et Archéologie</a>').setIcon(new L.Icon({iconUrl: 'icon/art.png', iconSize: [tailleIcon, tailleIcon]})));
    artPlace.push(L.marker([49.026568389564, 1.150752156553225], {dataName: 'Maison des Arts Solange Baudoux'}).bindPopup('<a href="https://evreux.fr/sortir/culture/musee-evreux/">Maison des Arts Solange Baudoux</a>').setIcon(new L.Icon({iconUrl: 'icon/art.png', iconSize: [tailleIcon, tailleIcon]})));
    artPlace.push(L.marker([49.022821493236926, 1.151041068970955], {dataName: 'Atelier de Léo Galerie d`art'}).bindPopup('<a href="http://www.leoart.net/">Atelier de Léo Galerie d`art</a>').setIcon(new L.Icon({iconUrl: 'icon/art.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Points d'eau-
    // coordonne a ameliorer si il y'a le temps !!!
    eauPlace.push(L.marker([49.02018355507679, 1.1496412734206904], {dataName: 'Point d`eau jardin public'}).bindPopup('<a href="#">Point d`eau jardin public</a>').setIcon(new L.Icon({iconUrl: 'icon/eau.png', iconSize: [tailleIcon, tailleIcon]})));
    eauPlace.push(L.marker([49.0248608538527, 1.1502845306737144], {dataName: 'Point d`eau jardin cathédrale'}).bindPopup('<a href="#">Point d`eau jardin cathédrale</a>').setIcon(new L.Icon({iconUrl: 'icon/eau.png', iconSize: [tailleIcon, tailleIcon]})));
    eauPlace.push(L.marker([49.02342916799356, 1.1556594034558134], {dataName: 'Point d`eau cimetière Saint Louis'}).bindPopup('<a href="#">Point d`eau cimetière Saint Louis</a>').setIcon(new L.Icon({iconUrl: 'icon/eau.png', iconSize: [tailleIcon, tailleIcon]})));
    eauPlace.push(L.marker([49.011196740813745, 1.1620122156008357], {dataName: 'Point d`eau cimetière Saint André'}).bindPopup('<a href="#">Point d`eau cimetière Saint André</a>').setIcon(new L.Icon({iconUrl: 'icon/eau.png', iconSize: [tailleIcon, tailleIcon]})));
    eauPlace.push(L.marker([49.02086148421744, 1.119101372582145], {dataName: 'Point d`eau cimetière de Navarre'}).bindPopup('<a href="#">Point d`eau cimetière de Navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/eau.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Lieux historique-
    historiquePlace.push(L.marker([49.0243738946071, 1.1509281230059696], {dataName: 'La cathédrale Notre Dame'}).bindPopup('<a href="https://www.patrimoine-histoire.fr/P_Normandie/Evreux/Evreux-Notre-Dame.htm">La cathédrale Notre Dame</a>').setIcon(new L.Icon({iconUrl: 'icon/historique.png', iconSize: [tailleIcon, tailleIcon]})));
    historiquePlace.push(L.marker([49.02614323969767, 1.1512163002566567], {dataName: 'Pavillon Fleuri'}).bindPopup('<a href="https://evreux.fr/decouvrir-evreux/monuments-evreux/le-pavillon-fleuri/">Pavillon Fleuri</a>').setIcon(new L.Icon({iconUrl: 'icon/historique.png', iconSize: [tailleIcon, tailleIcon]})));
    historiquePlace.push(L.marker([49.023952848544596, 1.141407319433761], {dataName: 'Église Saint-Taurin'}).bindPopup('<a href="https://www.patrimoine-histoire.fr/P_Normandie/Evreux/Evreux-Saint-Taurin.htm">Pavillon Fleuri</a>').setIcon(new L.Icon({iconUrl: 'icon/historique.png', iconSize: [tailleIcon, tailleIcon]})));
    historiquePlace.push(L.marker([49.021169658410365, 1.15090276917998], {dataName: 'Couvent des Capucins'}).bindPopup('<a href="https://fr.wikipedia.org/wiki/Couvent_des_Capucins_d%27%C3%89vreux">Couvent des Capucins</a>').setIcon(new L.Icon({iconUrl: 'icon/historique.png', iconSize: [tailleIcon, tailleIcon]})));
    historiquePlace.push(L.marker([49.02688653363026, 1.1502652163685332], {dataName: 'Le Beffroi – Tour de l’horloge'}).bindPopup('<a href="https://evreux.fr/decouvrir-evreux/monuments-evreux/la-tour-de-lhorloge-ou-le-beffroi/">Le Beffroi – Tour de l’horloge</a>').setIcon(new L.Icon({iconUrl: 'icon/historique.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Lieux d'information-
    infoPlace.push(L.marker([49.02373449920583, 1.1493495595137675], {dataName: 'Office du tourisme evreux'}).bindPopup('<a href="http://www.lecomptoirdesloisirs-evreux.fr/">Office du tourisme evreux</a>').setIcon(new L.Icon({iconUrl: 'icon/info.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Jardin-
    jardinPlace.push(L.marker([49.020153916417975, 1.1506960668954485], {dataName: 'Jardin botanique'}).bindPopup('<a href="https://evreux.fr/sortir/parcs-jardins-et-balades/parc-jardin-serre/">Jardin botanique</a>').setIcon(new L.Icon({iconUrl: 'icon/jardin.png', iconSize: [tailleIcon, tailleIcon]})));
    jardinPlace.push(L.marker([49.029349452451, 1.169738748304181], {dataName: 'Jardin de Netreville'}).bindPopup('<a href="https://evreux.fr/">Jardin de Netreville</a>').setIcon(new L.Icon({iconUrl: 'icon/jardin.png', iconSize: [tailleIcon, tailleIcon]})));
    jardinPlace.push(L.marker([49.00479770199866, 1.150179333701478], {dataName: 'Jardin Secret de Pan'}).bindPopup('<a href="https://www.lejardinsecretdepan.fr/">Jardin Secret de Pan</a>').setIcon(new L.Icon({iconUrl: 'icon/jardin.png', iconSize: [tailleIcon, tailleIcon]})));
    jardinPlace.push(L.marker([49.02976854096607, 1.1335508803899024], {dataName: 'Jardin des coteaux de Saint-Michel de F.Simonaire'}).bindPopup('<a href="https://www.lejardinsecretdepan.fr/">Jardin des coteaux de Saint-Michel de F.Simonaire</a>').setIcon(new L.Icon({iconUrl: 'icon/jardin.png', iconSize: [tailleIcon, tailleIcon]})));
    jardinPlace.push(L.marker([49.02025863610502, 1.1495230993428647], {dataName: 'Serre jardin botanique'}).bindPopup('<a href="https://evreux.fr/sortir/parcs-jardins-et-balades/parc-jardin-serre/">Serre jardin botanique</a>').setIcon(new L.Icon({iconUrl: 'icon/jardin.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Point de vue-
    jumellesPlace.push(L.marker([49.031894931458325, 1.1473175585482334], {dataName: 'Vue panoramique d`évreux'}).bindPopup('<a href="#">Vue panoramique d`évreux</a>').setIcon(new L.Icon({iconUrl: 'icon/jumelles.png', iconSize: [tailleIcon, tailleIcon]})));
    jumellesPlace.push(L.marker([49.026334675675955, 1.162360361127273], {dataName: 'Vue panoramique d`évreux'}).bindPopup('<a href="#">Vue panoramique d`évreux</a>').setIcon(new L.Icon({iconUrl: 'icon/jumelles.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Mairie-
    mairiePlace.push(L.marker([49.02701441558723, 1.1514063806067707], {dataName: 'Mairie d\'Évreux'}).bindPopup('<a href="https://evreux.fr/">Mairie d\'Évreux</a>').setIcon(new L.Icon({iconUrl: 'icon/mairie.png', iconSize: [tailleIcon, tailleIcon]})));
    mairiePlace.push(L.marker([49.02663557689257, 1.1717314547964557], {dataName: 'Mairie annexe de Nétreville'}).bindPopup('<a href="https://evreux.fr/la-mairie/services/mairies-annexes/">Mairie annexe de Nétreville</a>').setIcon(new L.Icon({iconUrl: 'icon/mairie.png', iconSize: [tailleIcon, tailleIcon]})));
    mairiePlace.push(L.marker([49.01666545837922, 1.1236935064862954], {dataName: 'Mairie annexe de Navarre'}).bindPopup('<a href="https://evreux.fr/la-mairie/services/mairies-annexes/">Mairie annexe de Navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/mairie.png', iconSize: [tailleIcon, tailleIcon]})));
    mairiePlace.push(L.marker([49.009319333109275, 1.1592238130113732], {dataName: 'Mairie annexe de La Madeleine'}).bindPopup('<a href="https://evreux.fr/la-mairie/services/mairies-annexes/">Mairie annexe de La Madeleine</a>').setIcon(new L.Icon({iconUrl: 'icon/mairie.png', iconSize: [tailleIcon, tailleIcon]})));
    mairiePlace.push(L.marker([49.03297000482163, 1.1361738688974927], {dataName: 'Mairie annexe de Saint-Michel'}).bindPopup('<a href="https://evreux.fr/la-mairie/services/mairies-annexes/">Mairie annexe de Saint-Michel</a>').setIcon(new L.Icon({iconUrl: 'icon/mairie.png', iconSize: [tailleIcon, tailleIcon]})));
    
    // -markers de Urbex/Désaffecté-
    maisonPlace.push(L.marker([49.024681231999, 1.1650219320218818], {dataName: 'Usine Nétreville Philips'}).bindPopup('<a href="#">Urbex usine Nétreville</a>').setIcon(new L.Icon({iconUrl: 'icon/maison.png', iconSize: [tailleIcon, tailleIcon]})));
    maisonPlace.push(L.marker([49.016118235216226, 1.1209848510133373], {dataName: 'Usine de Navarre'}).bindPopup('<a href="#">Usine de Navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/maison.png', iconSize: [tailleIcon, tailleIcon]})));
    maisonPlace.push(L.marker([49.015833797486955, 1.1308112571000448], {dataName: 'Les 3 immeubles abandonnées'}).bindPopup('<a href="#">Les 3 immeubles abandonnées</a>').setIcon(new L.Icon({iconUrl: 'icon/maison.png', iconSize: [tailleIcon, tailleIcon]})));
    maisonPlace.push(L.marker([49.03955410474035, 1.1249129025005469], {dataName: 'Cité Lafayette (américaine)'}).bindPopup('<a href="https://fr.wikipedia.org/wiki/Cit%C3%A9_Lafayette_(%C3%89vreux)">Cité Lafayette (américaine)</a>').setIcon(new L.Icon({iconUrl: 'icon/maison.png', iconSize: [tailleIcon, tailleIcon]})));
    maisonPlace.push(L.marker([49.03624920036501, 1.1414338059138183], {dataName: 'Ancienne hopital américaine d`evreux'}).bindPopup('<a href="https://fr.wikipedia.org/wiki/Cit%C3%A9_Lafayette_(%C3%89vreux)">Ancienne hopital américaine d`evreux</a>').setIcon(new L.Icon({iconUrl: 'icon/maison.png', iconSize: [tailleIcon, tailleIcon]})));
    //ancienne hopital d'evreux

    // -markers de Chemins-
    sentierPlace.push(L.geoJSON.ajax("geojson/parcours-sportifs-saint-michel.geojson", {dataName: '[chemin] Parcour sportif st Michel'}));
    sentierPlace.push(L.marker([49.0358057661843, 1.126108168140265], {dataName: 'Début du Parcour sportif st Michel'}).bindPopup('<a href="#">Début du Parcour sportif st Michel</a>').setIcon(new L.Icon({iconUrl: 'icon/sentier.png', iconSize: [tailleIcon, tailleIcon]})));
    sentierPlace.push(L.geoJSON.ajax("geojson/Coteaux_de_saint_Michel.geojson", {dataName: '[chemin] coteaux de st Michel'}));
    sentierPlace.push(L.geoJSON.ajax("geojson/Panorama_evreux_cinema.geojson", {dataName: '[chemin] Panorama d`évreux'}));
    sentierPlace.push(L.geoJSON.ajax("geojson/Voie_verte_Évreux.geojson", {dataName: '[chemin] Voie verte'}));

    // -markers de Sports/J.O 2024-
    sportPlace.push(L.marker([49.017185832405126, 1.126595959278061], {dataName: 'Mouv`roc - sport plein air'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Mouv\'roc - sport plein air</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.02709014691586, 1.1703939008949693], {dataName: 'Parc Street workout - musculation en extérieur'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Parc Street workout - musculation en extérieur</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.03005944260493, 1.1803060224204367], {dataName: 'Terrain de football'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Terrain de football</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.01683085610241, 1.1167821390512076], {dataName: 'Terrain de football des Marronniers'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Terrain de football des Marronniers</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.021798825294404, 1.1282900390082073], {dataName: 'Stade Roger Rochard'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Stade Roger Rochard</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.0050878386349, 1.161876408159791], {dataName: 'Stade Mathieu Bodmer'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Stade Mathieu Bodmer</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.033551510613414, 1.1456511710273956], {dataName: 'Stade du Val Iton'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Stade du Val Iton</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.01995959354048, 1.1696158792582054], {dataName: 'Stade de Nétreville'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Stade de Nétreville</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.01683085610241, 1.1167821390512076], {dataName: 'Stades du Parc de Navarre'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Stades du Parc de Navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.02448123455674, 1.130482020784121], {dataName: 'Stade Alphonse Pierre'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Stade Alphonse Pierre</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.00987459521572, 1.1134130805162772], {dataName: 'Hippodrome de Navarre'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Hippodrome de Navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.0345019031241, 1.118325944950614], {dataName: 'Golf Municipal d\'Evreux'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Golf Municipal d\'Evreux</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.00718786598653, 1.1617759009180084], {dataName: 'Gymnase Pablo Néruda'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Pablo Néruda</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.02575322581877, 1.1591385980856772], {dataName: 'Gymnase Jean Jaurès'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Jean Jaurès</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.03363273578285, 1.1353547346134938], {dataName: 'Gymnase Artois'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Artois</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.00593753338902, 1.1558903698353686], {dataName: 'Gymnase Maxime Marchand'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Maxime Marchand</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.027676913252726, 1.171598262129472], {dataName: 'Gymnase Jean Bart'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Jean Bart</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.00697176820528, 1.1493826925783304], {dataName: 'Gymnase Georges Politzer'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Georges Politzer</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.01849254614756, 1.1220506674759905], {dataName: 'Gymnase de navarre'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase de navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.00823695687955, 1.1408488399889234], {dataName: 'Gymnase du Canada'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase du Canada</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.010982146887514, 1.1630501462122775], {dataName: 'Gymnase Irène et Frédéric Joliot-Curie'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Irène et Frédéric Joliot-Curie</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.01415215155127, 1.1509221040772952], {dataName: 'Gymnase Jean Moulin'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Gymnase Jean Moulin</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.02212833928095, 1.1391048163649613], {dataName: 'Salle Omnisports Jean Fourre'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Salle Omnisports Jean Fourre</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.0234270714207, 1.1295726589679964], {dataName: 'Skatepark navarre'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Skatepark navarre</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.00605377660724, 1.1595469170367798], {dataName: 'Bowl de la Madeleine'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Bowl de la Madeleine</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.0064433331647, 1.1613364717821628], {dataName: 'Piscine Plein Soleil'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Piscine Plein Soleil</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    sportPlace.push(L.marker([49.0221629331427, 1.1273308731985334], {dataName: 'Piscine Jean Bouin'}).bindPopup('<a href="../../presentation/presa+sport/lieux_sport.html">Piscine Jean Bouin</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));
    
    // -markers de Lieux culturels-
    theatrePlace.push(L.marker([49.022308255580334, 1.1377813841825224], {dataName: 'Le CADRAN - Palais des Congrès (Le Tangram)'}).bindPopup('<a href="http://www.letangram.com/">Le CADRAN - Palais des Congrès (Le Tangram)</a>').setIcon(new L.Icon({iconUrl: 'icon/theatre.png', iconSize: [tailleIcon, tailleIcon]})));
    theatrePlace.push(L.marker([49.026476293853854, 1.1517621606032578], {dataName: 'THÉÂTRE LEGENDRE (Le Tangram)'}).bindPopup('<a href="http://www.letangram.com/">THÉÂTRE LEGENDRE (Le Tangram)</a>').setIcon(new L.Icon({iconUrl: 'icon/theatre.png', iconSize: [tailleIcon, tailleIcon]})));
    theatrePlace.push(L.marker([49.02641222682504, 1.1519432240664265], {dataName: 'Médiathèque Rolland-Plaisance'}).bindPopup('<a href="https://mediatheques.evreux.fr/">Médiathèque Rolland-Plaisance</a>').setIcon(new L.Icon({iconUrl: 'icon/theatre.png', iconSize: [tailleIcon, tailleIcon]})));
    theatrePlace.push(L.marker([49.021535874162566, 1.1383081869871958], {dataName: 'Le KUBB - Salle de concert (Le Tangram)'}).bindPopup('<a href="http://www.letangram.com/">Le KUBB - Salle de concert (Le Tangram)</a>').setIcon(new L.Icon({iconUrl: 'icon/theatre.png', iconSize: [tailleIcon, tailleIcon]})));
    theatrePlace.push(L.marker([49.02946317293693, 1.1465665287297129], {dataName: 'Le Manège de Tilly spectacle'}).bindPopup('<a href="http://www.lemanegedetilly.fr/">Le Manège de Tilly spectacle</a>').setIcon(new L.Icon({iconUrl: 'icon/theatre.png', iconSize: [tailleIcon, tailleIcon]})));
    theatrePlace.push(L.marker([49.02120801387042, 1.1511401792028326], {dataName: 'Conservatoire'}).bindPopup('<a href="https://evreuxportesdenormandie.fr/471-le-conservatoire-a-rayonnement-departemental.htm">Conservatoire</a>').setIcon(new L.Icon({iconUrl: 'icon/theatre.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Toilettes publiques-
    toilettesPlace.push(L.marker([49.020380367794814, 1.1493014814471363], {dataName: 'Toilettes public jardin public'}).bindPopup('<a href="#">Toilettes public jardin public</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettesPlace.push(L.marker([49.0249926407912, 1.15051691430553], {dataName: 'Toilettes public jardin cathédrale'}).bindPopup('<a href="#">Toilettes public jardin cathédrale</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettesPlace.push(L.marker([49.027333626416365, 1.1477146256569224], {dataName: 'Toilettes public place du marché'}).bindPopup('<a href="#">Toilettes public place du marché</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettesPlace.push(L.marker([49.02701441558723, 1.1514063806067707], {dataName: 'Toilettes public mairie'}).bindPopup('<a href="#">Toilettes public mairie</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));

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
        "<span style='color: DarkSlateGray'>Batiments 3d</span>": batiments3d,
        "<span style='color: sienna'>Chemins</span>": lines,
        "<span style='color: olive'>Toponymes</span>": toponymes,
        "<span style='color: LightGray'>Piste de ski</span>": pistedeski,
        "<span style='color: rosyBrown'>Neige</span>": neige,
        "<span style='color: gold'>Températures</span>": temperature,
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
