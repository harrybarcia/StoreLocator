
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
  const res = await fetch('/api-stores');
  const data = await res.json();
  console.log('data');
  console.log(data);
try{
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
      }
    };
  });
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
  const image = e.features[0].properties.image;
  const storeId = e.features[0].properties._id;
  const userId = e.features[0].properties.userId;
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
    ${address}
  </span>
  <span style="overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
              line-clamp: 3; 
      -webkit-box-orient: vertical;
      max-height: 60px;">
    </strong>
    ${userId}
  </span>
  </div>

  <a href='/stores/${storeId}' class="btn">Details</a>


  `)
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