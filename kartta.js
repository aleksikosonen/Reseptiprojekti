 const kartta = document.getElementById("map");
 
 // Asetukset paikkatiedon hakua varten (valinnainen)
 const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  // Funktio, joka ajetaan, kun paikkatiedot on haettu
  function success(pos) {
    const crd = pos.coords;
  
    // Tulostetaan paikkatiedot konsoliin
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    
    // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
    const map = L.map('map').setView([crd.latitude, crd.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([crd.latitude, crd.longitude]).addTo(map)
    .bindPopup('Olen tässä.')
    .openPopup();

    L.marker([60.225012,24.7597426]).addTo(map)
    .bindPopup('S-Market karaportti')
    .openPopup();

    L.marker([60.2288653,24.7640059]).addTo(map)
    .bindPopup('Alepa karakallio')
    .openPopup();

    L.marker([60.2303213,24.7780506]).addTo(map)
    .bindPopup('Lidl karakallio')
    .openPopup();

    L.marker([60.218314,24.7796932]).addTo(map)
    .bindPopup('Alepa Kilo')
    .openPopup();

    L.marker([60.2344874,24.8141015]).addTo(map)
    .bindPopup('Alepa Lintuvaara')
    .openPopup();

    L.marker([60.2268888,24.7399687]).addTo(map)
    .bindPopup('Alepa Viherlaakso')
    .openPopup();

    L.marker([60.2118691,24.7677545]).addTo(map)
    .bindPopup('K-Market Lansa')
    .openPopup();

    L.marker([60.2289337,24.814258]).addTo(map)
    .bindPopup('K-Market Vallikallio')
    .openPopup();

    L.marker([60.2182897,24.8108427]).addTo(map)
    .bindPopup('Sellon kauppakeskus')
    .openPopup();

    L.marker([60.2405944,24.7004605]).addTo(map)
    .bindPopup('K-Supermarket Aurora')
    .openPopup();

    L.marker([60.240621,24.7405275]).addTo(map)
    .bindPopup('S-Market Lähderanta')
    .openPopup();

    L.marker([60.2397483,24.7402199,21]).addTo(map)
    .bindPopup('K-Supermarket Lähderanta')
    .openPopup();

    L.marker([60.2477948,24.7671133,21]).addTo(map)
    .bindPopup('K-Market Laaksolahti')
    .openPopup();

    L.marker([60.2297476,24.7160807,21]).addTo(map)
    .bindPopup('K-Market Ravioli')
    .openPopup();
  }
  
  // Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  // Käynnistetään paikkatietojen haku
  navigator.geolocation.getCurrentPosition(success, error, options);