// demande de la localisation à l'utilisateur
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

// Si l"utilisateur l'autorise, on récupère les coordonnées dans l'objet "position"
function showPosition(position) {
  // paramètres pour l'affichage de la carte openstreetmap
  // Définir un facteur d’échelle selon le zoom (plus zoomé → bbox plus petite)
  const zoom = 5;
  const delta = 0.05 / Math.pow(2, zoom - 10);

  const bboxEdges = {
    south: position.coords.latitude - delta,
    north: position.coords.latitude + delta,
    west: position.coords.longitude - delta,
    east: position.coords.longitude + delta,
  };

  const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${position.coords.latitude}%2C${position.coords.longitude}`;

  // Injecter l'iframe
  document.getElementById("map").innerHTML = `
        <iframe
          width="100%"
          height="200"
          frameborder="0"
          scrolling="no"
          src="${iframeSrc}" >
        </iframe>
      `
document.getElementById("adresse").value = position.coords.latitude + ", " + position.coords.longitude;
calcNbChar("adresse");
}

  
// Au cas ou l'utilisateur refuse
// Ou si une erreur arrive
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.querySelector("#map").innerHTML =
        "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.querySelector("#map").innerHTML =
        "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.querySelector("#map").innerHTML =
        "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.querySelector("#map").innerHTML = "An unknown error occurred.";
      break;
  }
}