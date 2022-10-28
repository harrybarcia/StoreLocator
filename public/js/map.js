

const data = JSON.parse($('#variableJSON').text());

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 11,
  center: [-123.1, 49.25]
  
  
});


  

// const directions = 
//   new MapboxDirections({
//     accessToken: mapboxgl.accessToken
//   });
// map.addControl(directions, 'top-left')

  
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
            icon: 'rocket',
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
      
      const markers = document.getElementsByClassName("mapboxgl-marker");
      console.log(markers);
      if (markers[0]) markers[0].remove();
      console.log(markers);
      const coordinates = e.lngLat;
      
      const marker = new mapboxgl.Marker(
        {
          color: "red",
          draggable: true
        }
      )
      if (markers[0]) markers[0].remove();
      marker.setLngLat(coordinates).addTo(map);
      




      
      const arrayCoordinates = [coordinates.lng, coordinates.lat];
      const stores = data.map(store => {
        const mystore = store.location.coordinates;
        const distance = Math.round(turf.distance(
          turf.point(arrayCoordinates),
          turf.point(mystore),
          {units: 'meters'}
          ));
        store.distance = distance;
        return store; 
        });
        console.log("stores", stores);
        stores.sort((a, b) => {
        if (a.distance > b.distance) {
          return 1;
        }
        if (a.distance < b.distance) {
          return -1;
        }
        return 0; // a must be equal to b
      });

      const listings = document.getElementById('listings');
      listings.innerHTML = '';
      listings.className = "listings w-1/6 bg-gray-900 h-screen sidebar";
      for (let i = 0; i < stores.length; i++) {
        
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));

        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${stores[i].city}, ${stores[i].location.formattedAddress}`;
        details.innerHTML += `<div><strong>${stores[i].distance.toLocaleString('en').replace(/,/g,' ')} meters away</strong></div>`;
        details.style = "color: white; padding: 20px;";
        details.innerHTML += `<a href='/stores/${stores[i]._id}' class="btn">Details</a>`;
      }
    });

    
    
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
      });

      geocoder.addTo('#geocoder');

      var geocoderResult = {};
      geocoder.on('result', (e) => {
        geocoderResult = e.result, null, 2;
      });
      
      // Clear results container when search is cleared.
      geocoder.on('clear', () => {
        geocoderResult = {};
      });
      geocoder.on('result', (event) => {
        
        const x = document.createElement("input");
        x.setAttribute("type", "hidden");
        x.setAttribute("value", event.result.place_name);
        x.setAttribute("name", "address");
        const y = document.getElementById("store-form");
        y.appendChild(x);
        

        
      });
      const resultGeocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      
        })
      
        map.addControl(resultGeocoder);

      resultGeocoder.on('result', (event) => {
        const searchResult = event.result.geometry;
        const coordinates = searchResult.coordinates;
        const arrayCoordinates = [coordinates[0], coordinates[1]];
        const stores = data.map(store => {
          const mystore = store.location.coordinates;
          const distance = Math.round(turf.distance(
            turf.point(arrayCoordinates),
            turf.point(mystore),
            {units: 'meters'}
            ));
          store.distance = distance;
          return store; 
          });
          console.log("stores", stores);
          stores.sort((a, b) => {
          if (a.distance > b.distance) {
            return 1;
          }
          if (a.distance < b.distance) {
            return -1;
          }
          return 0; // a must be equal to b
        });
    
        const listings = document.getElementById('listings');
        
        listings.innerHTML = '';
        listings.className = "listings w-1/6 bg-gray-900 h-screen sidebar ";
        const listing = listings.appendChild(document.createElement('div'));
        
        for (let i = 0; i < stores.length; i++) {
          const details = listing.appendChild(document.createElement('div'));
          details.innerHTML = `${stores[i].city}, ${stores[i].location.formattedAddress}`;
          details.innerHTML += `<div><strong>${stores[i].distance.toLocaleString('en').replace(/,/g,' ')} meters away</strong></div>`;
         
        }
      });
      

      // directions.on('route', function(e) {
        //   console.log(e);
        // });
        
        // Quand je click sur la carte, je veux récupérer les stores dans un rayon de 1km et leur attribuer une couleur différente

        map.on('click', function(e) {
          // je récupère les coordonnées du point sur lequel je viens de cliquer
          const coordinates = e.lngLat;
          const arrayCoordinates = [coordinates.lng, coordinates.lat];
          // je remove les markers
          const markers = document.getElementsByClassName("mapboxgl-marker");
          console.log(markers);
          if (markers) for (let i = 0; i < markers.length; i++) {markers[i].remove();}

          // je récupère les stores et leurs distances par rapport au point sur lequel je viens de cliquer
          const stores = data.map(store => {
            const mystore = store.location.coordinates;
            const distance = Math.round(turf.distance(
              turf.point(arrayCoordinates),
              turf.point(mystore),
              {units: 'meters'}
              ));
            store.distance = distance;
            if (distance < 2000) {
                const marker = new mapboxgl.Marker(
                  {
                    color: "green",
                    draggable: true
                  }
                )
                .setLngLat(mystore)
                .addTo(map);
            }
            return store;
          });
        });

        // je veux loop sur une liste d'adresses geojson
        // je récupère les coordonnées de chaque adresse dans un geojson, je les transforme en array, je loop dans mon geocoder.
        


        // Quand je cherche un centre de formation, idem

