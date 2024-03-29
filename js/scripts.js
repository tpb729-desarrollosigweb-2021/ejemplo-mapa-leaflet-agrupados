// Mapa Leaflet
var mapa = L.map('mapid').setView([9.5, -84.10], 8);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm
};	    


// Ícono personalizado para carnivoros
const iconoCarnivoro = L.divIcon({
  html: '<i class="fas fa-cat fa-2x"></i>',
  className: 'estiloIconos'
});


// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	


// Control de escala
L.control.scale().addTo(mapa);
	    

// Capa vectorial de registros agrupados de carnívoros
$.getJSON("https://tpb729-desarrollosigweb-2021.github.io/datos/gbif/carnivora-cr-wgs84.geojson", function(geodata) {
  // Registros individuales
  var capa_carnivora = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Especie</strong>: " + feature.properties.species + "<br>" + 
                      "<strong>Localidad</strong>: " + feature.properties.locality + "<br>" + 
                      "<strong>Fecha</strong>: " + feature.properties.eventDate + "<br>" + 
                      "<strong>Institución</strong>: " + feature.properties.institutionCode + "<br>" + 
                      "<br>" +
                      "<a href='" + feature.properties.occurrenceID + "'>Más información</a>";
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoCarnivoro});
    }
  });

  // Capa de puntos agrupados
  var capa_carnivora_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_carnivora_agrupados.addLayer(capa_carnivora);

  // Se añade la capa al mapa y al control de capas
  capa_carnivora_agrupados.addTo(mapa);
  control_capas.addOverlay(capa_carnivora_agrupados, 'Registros agrupados de carnívoros');
  control_capas.addOverlay(capa_carnivora, 'Registros individuales de carnívoros');
});
