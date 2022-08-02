
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 9,
  center: [2.48,48.8]
});
map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
  })
  );
  
// Fetch stores from API
async function getStores() {
  const res = await fetch('/api/v1/stores');
  const data = await res.json();

  const stores = data.data.map(store => {
    console.log(store)
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
        storeId: store.storeId,
        formattedAddress:store.location.formattedAddress,  
        icon: 'shop',
        image:store.image
      }
    };
  });
  loadMap(stores);
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
        'text-field': '{storeId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
}


map.on('click', 'points', (e) => {
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  const address = e.features[0].properties.formattedAddress;
  const image=e.features[0].properties;
  console.log(image);
   console.log(e.features[0].properties.image);
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
   
  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(`<img src='${image}.replace("C:\fakepath", "./uploads")' style="width:100px;height:100px">`
  )
  .addTo(map);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.flyTo({
        center: [position.coords.longitude,position.coords.latitude
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
     });
    });
  }


getStores();