
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
  
    // Add a data source containing GeoJSON data.
    map.addSource('maine', {
          'type': 'geojson',
          
          'data': {
          'type': 'Feature',
          'geometry': {
          'type': 'Polygon',
          // These coordinates outline Maine.
          'coordinates': [
            [  
              [-123.11, 49.36],
              [-123.05, 49.36],
              [-123.05, 49.33],
              [-123.11, 49.33],
              [-123.11, 49.36]
            ]
          ]
        }
      }
    });
    // Add a new layer to visualize the polygon.
map.addLayer({
  'id': 'maine',
  'type': 'fill',
  'source': 'maine', // reference the data source
  'layout': {},
  'paint': {
  'fill-color': '#0080ff', // blue color fill
  'fill-opacity': 0.5
  }
  });
  // Add a black outline around the polygon.
  map.addLayer({
  'id': 'outline',
  'type': 'line',
  'source': 'maine',
  'layout': {},
  'paint': {
  'line-color': '#000',
  'line-width': 3
  }
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

map.on('mousemove', (e) => {
  document.getElementById('info').innerHTML =
  // `e.point` is the x, y coordinates of the `mousemove` event
  // relative to the top-left corner of the map.
  JSON.stringify(e.point) +
  '<br />' +
  // `e.lngLat` is the longitude, latitude geographical position of the event.
  JSON.stringify(e.lngLat.wrap());
  });
  
//   const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';
// async function getISS() {
//   const res = await fetch(api_url);
//   const data = await res.json();
//   console.log(data);
//   const {latitude, longitude} = data;
//   console.log(latitude, longitude);
//   // Create a popup, but don't add it to the map yet.
  
//   var marker = new mapboxgl.Marker({ color: 'green' })
//   marker.setLngLat([longitude, latitude])

//   marker.setPopup(marker.setHTML("<h1>Hello World!</h1><img id= 'myImg' style = height = '100%' width = '100%' src = 'somePicture.jpeg' > </img>"))

//   marker.addTo(map);
  
//   ;

  
// }
// getISS();

// setInterval(getISS, 1000);

// map.on('load', async () => {
//   // Get the initial location of the International Space Station (ISS).
//   console.log("1")

//   const geojson = await getLocation();
  
//   // Add the ISS location as a source.
//   map.addSource('iss', {
//     type: 'geojson',
//   data: geojson
// });
// // Add the rocket symbol layer to the map.
//   map.addLayer({
//   'id': 'iss',
//   'type': 'symbol',
//   'source': 'iss',
//   'layout': {
//     'icon-image': 'rocket-15'
//   }
//   });
   
  // Update the source from the API every 2 seconds.
  // const updateSource = setInterval(async () => {
  // const geojson = await getLocation(updateSource);
  // map.getSource('iss').setData(geojson);
  // }, 50000);
  
  
  // async function getLocation(updateSource) {
  //   console.log("3")
  // // Make a GET request to the API and return the location of the ISS.
  // try {
  // const response = await fetch(
  // 'https://api.wheretheiss.at/v1/satellites/25544',
  // { method: 'GET' }
  // );
  // const { latitude, longitude } = await response.json();
  // // Fly the map to the location.
  // map.flyTo({
  // center: [longitude, latitude],
  // speed: 0.5
  // });
  // // Return the location of the ISS as GeoJSON.
  // return {
  // 'type': 'FeatureCollection',
  // 'features': [
  // {
  // 'type': 'Feature',
  // 'geometry': {
  // 'type': 'Point',
  // 'coordinates': [longitude, latitude]
  // }
  // }
  // ]
  // };
  // } catch (err) {
  // // If the updateSource interval is defined, clear the interval to stop updating the source.
  // if (updateSource) clearInterval(updateSource);
  // throw new Error(err);
  // }
  // }
  // });