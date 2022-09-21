

const data = JSON.parse($('#variableJSON').text());


mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 11,
  center: [-123.1, 49.25]
  
  
});
map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
  })
  );
  
// Fetch stores from API
  function getStores() {
    try{
      console.log("data", data);
      const stores = data.map(store => {
        return {

          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              store.location.coordinates[0],
              store.location.coordinates[1]
            ]
          },
          properties: {
            _id: store._id,
            storeId: store.storeId,
            formattedAddress:store.location.formattedAddress,  
            icon: 'shop',
            image:store.image,
            userId:store.userId,
            city:store.city
          }
        };
      });
      console.log("stores", stores);
      loadMap(stores);
    }
    catch(err){
      console.log(err);
    }
}

// Load map with stores
function loadMap(stores) {
  map.on('load', function() {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stores
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 1.5,
        'text-field': '{city}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
  

}
getStores();
map.on('click', 'points', (e) => {
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  const address = e.features[0].properties.formattedAddress;
  const image = e.features[0].properties.image;
  const storeId = e.features[0].properties._id;
  const userId = e.features[0].properties.userId;
  const city = e.features[0].properties.city;
    console.log(e.features);
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
    
  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(`
    <img src='/images/${image}' style="width:100%;max-height:200px; border-radius:3%;max-height: 182px;object-fit: cover">
    <div>
    <span style="overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
                line-clamp: 3; 
        -webkit-box-orient: vertical;
        max-height: 60px;">
      </strong>
      ${city}
    </span>
    <span style="overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
                line-clamp: 3; 
        -webkit-box-orient: vertical;
        max-height: 60px;">
      </strong>
      ${city}
    </span>
    </div>
    <a href='/stores/${storeId}' class="btn">Details</a>
    `)
  .addTo(map);
});

// I retrieve all the distances from the point I just clicked
    map.on('click', function(e) {
      console.log(e);
      const coordinates = e.lngLat;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('Your destination!')
        .addTo(map);

      const arrayCoordinates = [coordinates.lng, coordinates.lat];
      const stores = data.map(store => {
        const mystore = store.location.coordinates;
        const distance = Math.round(turf.distance(
          turf.point(arrayCoordinates),
          turf.point(mystore),
          {units: 'meters'}
          ));
          const listings = document.getElementById('listings');
          const listing = listings.appendChild(document.createElement('div'));
          const details = listing.appendChild(document.createElement('div'));
          details.innerHTML = `${store.city}, ${store.location.formattedAddress}`;
          details.innerHTML += `<div><strong>${distance} meters away</strong></div>`;


        });
  });

  function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    for (const marker of stores.features) {
      /* Create a div element for the marker. */
      const el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = `marker-${marker.properties.id}`;
      /* Assign the `marker` class to each marker for styling. */
      el.className = 'marker';
  
      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    }
  }



