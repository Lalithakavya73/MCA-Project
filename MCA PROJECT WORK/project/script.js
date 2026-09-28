
async function getCoordinates(place) { 
  const response = await 
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`); 
  const data = await response.json(); 
  if (data && data.length > 0) { 
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)]; 
  } 
  alert(`Location not found: ${place}`); 
  return null; 
} 
 
async function geocodeAndShowMap() { 
  const startName = document.getElementById("startPlace").value; 
  const endName = document.getElementById("endPlace").value; 
  const startCoords = await getCoordinates(startName); 
  const endCoords = await getCoordinates(endName); 
  if (!startCoords || !endCoords) return; 
 
  document.getElementById("map").style.display = "block"; 
  const map = L.map("map").setView(startCoords, 7); 
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
    attribution: '&copy; OpenStreetMap contributors' 
  }).addTo(map); 
 
  // Add markers 
  L.marker(startCoords).addTo(map).bindPopup(" Arrival").openPopup(); 
  L.marker(endCoords).addTo(map).bindPopup("      Destination"); 
 
  // Draw path 
  const route = L.polyline([startCoords, endCoords], { color: "blue" }).addTo(map); 
  map.fitBounds(route.getBounds()); 
 
  // Black spots around Visakhapatnam 
  const blackSpots = [ 
    { name: "Gajuwaka Junction", lat: 17.6803, lng: 83.2162 }, 
    { name: "NAD Junction", lat: 17.7330, lng: 83.3014 }, 
    { name: "Maddilapalem", lat: 17.7384, lng: 83.3203 } ]; 
  blackSpots.forEach(spot => { 
    const dist = Math.sqrt(Math.pow(spot.lat - startCoords[0], 2) + Math.pow(spot.lng - startCoords[1], 2)); 
    if (dist < 1) { 
      L.marker([spot.lat, spot.lng]) 
        .addTo(map) 
        .bindPopup(`<b>${spot.name}</b><br>     Black Spot`); 
    } 
  }); 
}