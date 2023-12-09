/****************** GPS **************************/

//Element mit id p_geoloc wird der Variable x zugewiesen
var x = document.getElementById("p_geoloc");

// Variablendeklaration für die API
var ort = document.getElementById("loc");
var radius = document.getElementById("rad");

//Geo-location API nutzt das globale Navigator-Objekt
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
        console.log("error")
    }
}

/*Positions Callback*/
async function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;

    var overpassQuery = `
    [out:json]
    [timeout:90];
    (node(around:${radius},${position.coords.longitude}, ${position.coords.latitude} )[amenity = ${ort}];);
    out geom;
    `;

    //URL
    var url = fetch("https://overpass-api.de/api/interpreter");

    // Durch {} wird ein Objekt erstellt
    var fetchData = {
        //HTTP-Request-Methode, bei der man zusächtliche Optionen definieren kann -> Get downloaded den gesamten Inhalt der URL
        method: "POST",
        body: "data="+ encodeURIComponent(overpassQuery)
    };

    // Fetch gibt ein Promise zurück
    var response = await fetch(url, fetchData)
        .then((data)=>data.json())
        .then(jsonData => {console.log(JSON.stringify(response))});
}

/*Error Callback */
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

/*async function datenOverpass(adresse, optionen){
    return await fetch(adresse, optionen);
};*/