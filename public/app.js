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
    
    const map = L.map('map', {layers: [Satellite]}).setView([49.02188501857289, 1.165796267840064], 18);
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
    var osmb = new OSMBuildings().load('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');

    //----------------Markers/Points sur la carte et données d'informations------------------
    // création d'un groupes de marqueurs
    const markers = L.layerGroup();

    // récupération de la taille de l'icône à partir de l'URL du client
    function getUrlParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const tailleIconInput = document.getElementById('tailleIconInput');
    const tailleIcon = getUrlParameter('tailleIcon') || 28;
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
    var foyer = L.polygon(
        [[49.02165798958339, 1.1631121630141763], [49.02144374302472, 1.1632170749776947], [49.021499658722206, 1.1634594727381113], [49.021707299576434, 1.1633506946629666], [49.02165798958339, 1.1631121630141763]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Foyer (MDL)'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info foyer ici</a>').openPopup();    
    
    var cantine = L.polygon(
        [[49.02171209338604, 1.1633535855387436], [49.02151291278017, 1.1634585625457703], [49.02177450926399, 1.1646748961331639], [49.02183141779108, 1.1646441028779009], [49.021810306570586, 1.1645657200460278], [49.02179378473994, 1.164571318819526], [49.02176074106271, 1.1644257507028044], [49.02189842290795, 1.164354366338614], [49.021921369845586, 1.1644453464109858], [49.02195257766337, 1.1644341488639327], [49.0218442680941, 1.1639456558577308], [49.021921369845586, 1.1639050647488034], [49.021930548617235, 1.1639316589239002], [49.02198837484187, 1.1639022653612017], [49.02189842290795, 1.1635005533480296], [49.02175706954117, 1.1635747370997649], [49.02172402583906, 1.163412372662492], [49.02176441258342, 1.1633927769543106], [49.02175339801994, 1.1633367892173396], [49.02171209338604, 1.1633535855387436]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Cantine'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info cantine ici</a>').openPopup();
    
    var administration = L.polygon(
        [[49.021816578367435, 1.1645556259747423], [49.02184411473635, 1.1646983947039473], [49.022157110390026, 1.164540229346727], [49.02212957419425, 1.164408658164632], [49.022079091129456, 1.1644296535662306], [49.02206348726253, 1.164358269201216], [49.02201025050411, 1.1643876627639145], [49.02201025050411, 1.1644044590844942], [49.02192121648807, 1.1644506489677724], [49.02192855950494, 1.1644800425296467], [49.02188909077222, 1.1645010379312168], [49.021890008650075, 1.164515034865019], [49.021816578367435, 1.1645556259747423]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Administration'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info administration ici</a>').openPopup();
    
    var hall = L.polygon(
        [[49.02212773843391, 1.1645626245289975], [49.022032279501474, 1.1646060150246456], [49.022040540377645, 1.164634008893131], [49.0220194292464, 1.1646396076666576], [49.02203870462748, 1.1647263886597443], [49.02202493649875, 1.1647361865133803], [49.022035033127025, 1.1647935739437116], [49.02205430850205, 1.1647865754768247], [49.02208643411072, 1.1649447408339881], [49.02210754521349, 1.1649335432869066], [49.02211947757223, 1.1649699353156961], [49.0222075933622, 1.1649251451258067], [49.022201168257425, 1.1648957515639609], [49.022209429106084, 1.164885953710268], [49.02218923591886, 1.1647893748635738], [49.02214793164612, 1.1646382079732973], [49.02212773843391, 1.1645626245289975]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Hall'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info hall ici</a>').openPopup();

    var bat1 = L.polygon(
        [[49.02224223509796, 1.16490950361748], [49.0219356389797, 1.165068393303386], [49.02196558009024, 1.165196235578236], [49.02210929716915, 1.165121356531273], [49.022227863447256, 1.165630899315829], [49.02208175142795, 1.165705778362792], [49.02211049480971, 1.1658628417304726], [49.02225900201893, 1.1657824837279236], [49.02236798686587, 1.1662591527843915], [49.02222187525797, 1.1663449897414466], [49.02225540910757, 1.166502053108104], [49.02240152061697, 1.1664253477429156], [49.022512194450826, 1.1669053551238733], [49.022446618780094, 1.1669421363874335], [49.02251068696515, 1.1672455818100218], [49.02273228447507, 1.1671237108226364], [49.022714925886845, 1.1670289277031713], [49.02272388515877, 1.1670272198992677], [49.02269140778975, 1.1668572934076735], [49.02267684896191, 1.1668641246232312], [49.022666209815924, 1.1668222834263986], [49.022619733519804, 1.1668470465833138], [49.02250606239687, 1.1663475139298498], [49.022553098755196, 1.166322750772963], [49.022528460668326, 1.1662014966927075], [49.02257161302069, 1.166177166373103], [49.02245352023138, 1.1656337630690246], [49.022437445162325, 1.1656405042886888], [49.022426996364516, 1.1656043468427697], [49.022398864975145, 1.1656178292805635], [49.02238404514782, 1.1655492097614228], [49.022334368899465, 1.1655721652720388], [49.02222307956481, 1.1650689440662916], [49.0222708651695, 1.1650441113041552], [49.02224223509796, 1.16490950361748]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 1'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bâtiment 1 ici</a>').openPopup();

    var bat2 = L.polygon(
        [[49.02273445037076, 1.1671152314777373], [49.02269971263274, 1.1671288761081655], [49.02270023896199, 1.1671481391160228], [49.022512865290054, 1.1672332173986035], [49.02250326624733, 1.1671965949170442], [49.02221443804683, 1.1673461658411952], [49.022221034695576, 1.167379581228431], [49.02199742686906, 1.1674902210036748], [49.022007502283, 1.1675412024410434], [49.02186525696317, 1.1676074265266152], [49.02196215836287, 1.1680611345208547], [49.02197717123883, 1.1681235714000024], [49.02216760351041, 1.1680183552786332], [49.02218384443623, 1.16809430529608], [49.02252247099622, 1.1679281799733587], [49.02250986258042, 1.1678547873178502], [49.022780504215945, 1.1677175960182637], [49.02276768867367, 1.1676436989476429], [49.0228367544218, 1.1676101631103677], [49.02273445037076, 1.1671152314777373]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 2'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bâtiment 2 ici</a>').openPopup();

    var gymnase = L.polygon(
        [[49.0218600211779, 1.1676084714506487], [49.02178446165584, 1.1676467154701982], [49.021776644199065, 1.167599776105476], [49.02156919710501, 1.167653917306069], [49.02156511809895, 1.167637483832067], [49.021516304154744, 1.1676613016987858], [49.021525472811675, 1.1677148802225474], [49.0215015502113, 1.1677278319088202], [49.02151094665774, 1.167768636544622], [49.0215889671384, 1.1681423103010502], [49.021938376912374, 1.1679643586398072], [49.0218600211779, 1.1676084714506487]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Gymnase'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info gymnase ici</a>').openPopup();

    var bat3 = L.polygon(
        [[49.02274707688903, 1.1680018044894496], [49.02188801878887, 1.16843928365671], [49.02200891860579, 1.1689929928272136], [49.02286810395313, 1.1685488205042134], [49.02274707688903, 1.1680018044894496]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 3'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bâtiment 3 ici</a>').openPopup();

    var garage = L.polygon(
        [[49.022500215909815, 1.1692686925483997], [49.022561172899714, 1.1695603823431497], [49.022870555165156, 1.1693942382210594], [49.02286290868514, 1.1693521105473792], [49.02288377036268, 1.169340310889936], [49.02287203760969, 1.169278875315996], [49.022850501675265, 1.1692848234960422], [49.022811563938035, 1.1691054219495527], [49.022500215909815, 1.1692686925483997]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Garage'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info garage ici</a>').openPopup();

    var bat4 = L.polygon(
        [[49.02247877451529, 1.169172681502232], [49.0223604109799, 1.169232445422125], [49.022298491721415, 1.1689573240036566], [49.02192344781099, 1.1691526205112552], [49.02209130879811, 1.1699013671409944], [49.022461172051294, 1.1697190444052126], [49.02241877276521, 1.1695208960107095], [49.022473791364035, 1.1694940329915369], [49.02249656142661, 1.1695877278710896], [49.022560586205344, 1.1695513349794453], [49.02247877451529, 1.169172681502232]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 4'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bat4 ici</a>').openPopup();

    var bat5 = L.polygon(
        [[49.0212519096132, 1.1644013049587443], [49.021207003683315, 1.164397330732669], [49.02120370873868, 1.164438480760026], [49.020776292116636, 1.1643783120083526], [49.02076765773751, 1.1645032462026563], [49.020772291058364, 1.1645049426438163], [49.02076908513601, 1.164584133011516], [49.02078501650237, 1.1645991433487666], [49.02080231781102, 1.1645803518558466], [49.0208068439762, 1.1645462853350352], [49.02106040205072, 1.1645784554325758], [49.02106229021575, 1.1645715835884403], [49.02107395745213, 1.1645730942485955], [49.02107750933473, 1.164579765894473], [49.02112076195735, 1.1645968622321448], [49.021121519572546, 1.1645806265663339], [49.02113104036175, 1.1645818478580168], [49.02113041403234, 1.1646063790422545], [49.02123738893013, 1.1646197633146187], [49.0212519096132, 1.1644013049587443]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 5'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bat5 ici</a>').openPopup();

    var bat6 = L.polygon(
        [[49.0209526529425, 1.1637546209822744], [49.02091068445688, 1.1637493172970323], [49.02090628466536, 1.163781134445344], [49.02055339124291, 1.1637354778321765], [49.02055242338756, 1.1637099350197104], [49.020493914460815, 1.163703084561746], [49.020494561290974, 1.1637236053516915], [49.02047572200982, 1.1637270815766954], [49.02046807683567, 1.1638500929918791], [49.02083681562692, 1.1639016455517321], [49.02083367047072, 1.1639558942127337], [49.02094029193745, 1.1639702057053682], [49.020942304176174, 1.163933491412962], [49.02096235344726, 1.1639373029961746], [49.020986015013676, 1.1638271414294081], [49.02096672350763, 1.1638248067650636], [49.02097328023399, 1.1637924746411272], [49.02095241357176, 1.1637892180711162], [49.0209526529425, 1.1637546209822744]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 6'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bat6 ici</a>').openPopup();

    var bat7 = L.polygon(
        [[49.020874850514645, 1.1631357426027762], [49.020833483646555, 1.1631304957485042], [49.02082944475478, 1.1631665731032683], [49.020474954798885, 1.1631128092153915], [49.020474439118715, 1.1630923485102755], [49.020449753662035, 1.1630903800342764], [49.020452336614625, 1.1631101307680183], [49.020396805393744, 1.1631069081275314], [49.02038957345735, 1.1632299846024807], [49.02075784479311, 1.1632835855382382], [49.020756309370455, 1.163335897081737], [49.020861516411, 1.163353327842799], [49.02086385529731, 1.1633152817879306], [49.02088627476999, 1.1633165789733937], [49.02088727361041, 1.1633033683391147], [49.02090840163527, 1.1632081313232732], [49.020892424392315, 1.163200750902405], [49.02089598086289, 1.1631732712162943], [49.02087442609101, 1.1631685386254276], [49.020874850514645, 1.1631357426027762]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Batiment 7'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info bat7 ici</a>').openPopup();

    var Greta = L.polygon(
        [[49.02100509227745, 1.1625419739997085], [49.02096114836027, 1.162542332353496], [49.02095797051206, 1.1625761697472399], [49.020532606367084, 1.1625160992477959], [49.020522929589845, 1.1626430336910687], [49.020888246375705, 1.162693991651679], [49.020887241212534, 1.1627475696945169], [49.02099291008699, 1.1627625691046717], [49.020998955785274, 1.1627082715013444], [49.021014441706456, 1.1627109466683976], [49.02101833861707, 1.1626354251493467], [49.02100263272939, 1.162634218354384], [49.02100509227745, 1.1625419739997085]],
        {
            color: "#ff0000",
            fillColor: "#ff6666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Greta'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info Greta ici</a>').openPopup();    

    BatimentsPolygons.push(foyer, cantine, administration, hall, bat1, bat2, gymnase, bat3, garage, bat4, bat5, bat6, bat7, Greta);

    // -markers de Salles Importante-
    SallesImportante.push(L.marker([49.022066294911106, 1.1650882118194883], {dataName: 'Salle de permanance [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.02218719042311, 1.1652149785291157], {dataName: 'Vie Scolaire / CPE / Psy [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.022431264606546, 1.1657717103546468], {dataName: 'CDI [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.02259581704168, 1.1671070795810345], {dataName: 'Salle Louis Maury [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.021824029678434, 1.164313919358065], {dataName: 'Salle de l`Europe [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.020596678096695, 1.1638568076223212], {dataName: 'Infirmerie [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.020908012972654, 1.1639372738911764], {dataName: 'Bibliopret / PEEP [1er]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.02249982965343, 1.166984696054866], {dataName: 'Club Radio [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));
    SallesImportante.push(L.marker([49.02249032614423, 1.167692203651642], {dataName: 'Salle Radio [1er]'}).bindPopup('<a href="https://urlicilaaaa">text description url la et changer icon aussi</a>').setIcon(new L.Icon({iconUrl: 'icon/pin.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Lieux d'information-
    info.push(L.marker([49.02213033312576, 1.1646180776404018], {dataName: 'Accueil [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/info.png', iconSize: [tailleIcon, tailleIcon]})));
    info.push(L.marker([49.02204518983422, 1.1645240080080357], {dataName: 'Secrétariat de la scolarité [1er]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/info.png', iconSize: [tailleIcon, tailleIcon]})));
    info.push(L.marker([49.02248256330475, 1.1658561681541706], {dataName: 'Bureau professeur documentaliste CDI [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/info.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de sport-
    //sport.push(L.marker([49.02373449920583, 1.151], {dataName: 'Terrain de basket extérieur'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/sport.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de sport "Polygones"-
    var terrain_basket_hand = L.polygon(
        [[49.02134662444874, 1.1646991721121651], [49.0208370490154, 1.164971025557918], [49.02097819424455, 1.1655964509435535], [49.021489628827226, 1.165332045763762], [49.02134662444874, 1.1646991721121651]],
        {
            color: "#f5e645",
            fillColor: "#ffec17",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Terrain de Basket/Hand'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info terrain ici</a>').openPopup();    

    var terrain_petanque = L.polygon(
        [[49.02161916494899, 1.1649667409110407], [49.02145778877596, 1.1650478383689915], [49.02152343328356, 1.1653424174972429], [49.021685698576874, 1.1652546752915214], [49.02161916494899, 1.1649667409110407]],
        {
            color: "#f5e645",
            fillColor: "#ffec17",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Terrain de Pétanque'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info terrain ici</a>').openPopup();

    var piste_athletisme = L.polygon(
        [[49.02167426368425, 1.1652855296861446], [49.021612293993485, 1.165318599608014], [49.02166904003866, 1.165545808951265], [49.021626301119284, 1.1655131704182509], [49.021548341042745, 1.165462620258296], [49.02148418661483, 1.1654462747304422], [49.021403202957345, 1.1654478546965379], [49.02127481824141, 1.1655233307462254], [49.021208442386694, 1.1656238386233895], [49.02117096934879, 1.1657010673809793], [49.02116236533237, 1.1656655739975577], [49.02105250918339, 1.1657149358942434], [49.0214301705779, 1.167398410902365], [49.021570881861834, 1.1673252820707773], [49.02167130419133, 1.1673505687647037], [49.02179185058006, 1.1673039057777146], [49.02187117487253, 1.1672325043900287], [49.02194700595035, 1.1670902274037473], [49.02198934561346, 1.166933790778387], [49.02198659679513, 1.166757840528021], [49.021950915648375, 1.1665626964829698], [49.02185466477354, 1.166119417610048], [49.02177908738116, 1.1657870704240452], [49.02172091602648, 1.1655236764885615], [49.02160330689841, 1.1655949765596176], [49.02167930851789, 1.1656966979097092], [49.02174889582142, 1.1659061813290919], [49.02184705082064, 1.1663608454920507], [49.021934624445066, 1.166787607107949], [49.0218988412353, 1.1670299321795596], [49.02176565293033, 1.1672341635356815], [49.02158779228711, 1.1672482416899754], [49.021421855075346, 1.1670580092571186], [49.02118851341916, 1.1660629674193501], [49.02119909135217, 1.1658049089075178], [49.02130384783359, 1.1656128206156495], [49.02145756875558, 1.1655330826466752], [49.02158147496087, 1.1655708699302068], [49.021603285523156, 1.1655936745018778], [49.021720446865174, 1.1655238944099438], [49.021692235498875, 1.165380688074947], [49.02167426368425, 1.1652855296861446]],
        {
            color: "#f5e645",
            fillColor: "#ffec17",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Piste d\'athlétisme'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info piste ici</a>').openPopup();

    var terrain_sportif = L.polygon(
        [[49.02164065662015, 1.1656434618595028], [49.02119621536832, 1.1658580827632932], [49.02120175824237, 1.1660923663864935], [49.02141566047183, 1.1670248504097742], [49.021507790533576, 1.1671774707273244], [49.0215834039858, 1.1672300905970303], [49.021724084875984, 1.1672332313654294], [49.02185483969575, 1.1671135741772218], [49.021923131436154, 1.1669072696002445], [49.02192421907216, 1.1667254063157486], [49.021707195908306, 1.1657645197563795], [49.02164065662015, 1.1656434618595028]],
        {
            color: "#f5e645",
            fillColor: "#ffec17",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Terrain sportif'
        }
    ).bindPopup('<a href="lien_vers_la_page.html">info terrain ici</a>').openPopup();    
    
   sportPolygons.push(terrain_basket_hand, terrain_petanque, piste_athletisme, terrain_sportif);

    // -markers de toilettes-
    toilettes.push(L.marker([49.02218659042677, 1.1648641473212509], {dataName: 'Toilettes hall mixte (en travaux) [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.021551295355884, 1.1634032226756539], {dataName: 'Toilettes foyer mixte (si adhésion MDL) [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02176913980874, 1.1642329931260877], {dataName: 'Toilettes cantine homme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02173308197326, 1.1640841305287053], {dataName: 'Toilettes cantine femme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.022316164563854, 1.1655779661759897], {dataName: 'Toilettes bat1 mixte [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02246388966964, 1.1662661710142048], {dataName: 'Toilettes bat1 mixte [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.022617628561875, 1.1668610504435677], {dataName: 'Toilettes bat1 mixte [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.022334820499744, 1.1656291745959177], {dataName: 'Toilettes bat1 mixte [1er]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02248158028482, 1.166247468851344], {dataName: 'Toilettes bat1 mixte [1er]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02165235546742, 1.1678756686463967], {dataName: 'Toilettes gymnase homme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.021674541534225, 1.1680064853206533], {dataName: 'Toilettes gymnase femme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.0225792690205, 1.168433415405338], {dataName: 'Toilettes bat3 homme/femme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02235877682576, 1.1686614042554015], {dataName: 'Toilettes bat3 homme/femme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02232106218221, 1.169383441735178], {dataName: 'Toilettes bat4 homme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02233513336949, 1.1694424503323386], {dataName: 'Toilettes bat4 femme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.021185560536914, 1.1644888886861064], {dataName: 'Toilettes bat5 homme/femme [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02123920814112, 1.164530462925015], {dataName: 'Toilettes bat5 homme/femme [1er]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.021233051861586, 1.1645921537311374], {dataName: 'Toilettes bat5 homme/femme [2ème]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));
    toilettes.push(L.marker([49.02081033073713, 1.163835655728059], {dataName: 'Toilettes bat6 mixte (les fameux) [RDC]'}).bindPopup('<a href="https://urlicilaaaa">text description url la</a>').setIcon(new L.Icon({iconUrl: 'icon/toilettes.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de lieux Notables-
    lieuxNotables.push(L.marker([49.02197606944457, 1.165105136912723], {dataName: 'Buisson de la photo de classe'}).bindPopup('<a href="https://urlicilaaaa">lieu emblématique du lycée qui nous montre sa beauté une fois par an</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));
    lieuxNotables.push(L.marker([49.022714718289365, 1.1685367783843408], {dataName: 'Entrée sous-sol (interdit) [RDC]'}).bindPopup('<a href="https://urlicilaaaa">lieu légendaire du lycée où seuls quelques rares élus ont pénétré</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));
    lieuxNotables.push(L.marker([49.02239888358386, 1.169031051729405], {dataName: 'Allée couverte'}).bindPopup('<a href="https://urlicilaaaa">petite allée couverte avec un style bien à elle</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));
    lieuxNotables.push(L.marker([49.02140167737405, 1.1630875097520046], {dataName: 'Statue 1'}).bindPopup('<a href="https://urlicilaaaa">bien que moins connues, ces statues ont pourtant été le théâtre de nombreuses théories palpitantes</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));
    lieuxNotables.push(L.marker([49.02161022706215, 1.1629848863265104], {dataName: 'Statue 2'}).bindPopup('<a href="https://urlicilaaaa">bien que moins connues, ces statues ont pourtant été le théâtre de nombreuses théories palpitantes</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));
    lieuxNotables.push(L.marker([49.02151391960788, 1.1644917909650792], {dataName: 'Statue 3'}).bindPopup('<a href="https://urlicilaaaa">bien que moins connues, ces statues ont pourtant été le théâtre de nombreuses théories palpitantes</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));
    lieuxNotables.push(L.marker([49.02168298005651, 1.165155125863532], {dataName: 'Drapeaux'}).bindPopup('<a href="https://urlicilaaaa">Drapeaux aux lycée</a>').setIcon(new L.Icon({iconUrl: 'icon/star.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de lieux 3D-
    //lieux3D.push(L.marker([49.02373449920583, 1.151], {dataName: 'vue 3d du hall (c est un exemple !)'}).bindPopup('<a href="https://urlicilaaaa">description iciiiii</a>').setIcon(new L.Icon({iconUrl: 'icon/3d.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de Markers personnels- (pour debug c'est ici en gros)
    markersPersonnels.push(L.marker([0, 0], {dataName: 'debug point'}).bindPopup('<a href="https://urlicilaaaa">point de debug</a>').setIcon(new L.Icon({iconUrl: 'icon/location_point.png', iconSize: [tailleIcon, tailleIcon]})));

    // -markers de markers Personnels "Polygones"- (pour debug c'est ici aussi)
    var debugpolygon1 = L.polygon(
        [
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0]
        ],
        {
            color: "#000000",
            fillColor: "#666666",
            fillOpacity: 0.4,
            weight: 2,
            dataName: 'Polygone debug'
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
    }).addTo(map);

    // Variable pour suivre l'état de la précision
    var lastAccuracyState = null; // 'sufficient' ou 'insufficient' ou null

    // Liste pour suivre les notifications actives
    var activeNotifications = [];

    // Fonction pour afficher une notification
    function showNotification(type, title, message) {
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
        // Si la précision est suffisante, ne rien faire (pas de message)
        
        // Mettre à jour l'état de la précision
        lastAccuracyState = newAccuracyState;
    }
    });

    // Gérer les erreurs de localisation
    map.on('locationerror', function (e) {
    // Afficher une notification d'erreur si la localisation échoue
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
        "Lieux d'informations": { layer: infoLayer, icon: 'icon/info.png' },
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
                            listItem.addEventListener('click', () => map.setView(layer.getLatLng(), 19));
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
