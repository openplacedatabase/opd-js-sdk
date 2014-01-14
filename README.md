#opd-js-sdk

The javascript sdk for the Open Place Database API

##Install
`npm install opd-js-sdk --save`

##Examples

###Requiring
````
var opdSDK = require('opd-js-sdk'),
    opdClient = opdSDK.createClient();
````
Again, but with options
````
var opdSDK = require('opd-js-sdk'),
    opdClient = opdSDK.createClient({
      url:'localhost:8080/api'
    });
````

###Get a place
````
opdClient.getPlace('<place id>', function(error, data) {
  // Check if there was an error
  // data is the place
});
````

###Get many places
````
var placesIWant = ["<place1>",<place2>",<place3>"];

opdClient.getPlaces(placesIWant, function(error, data) {
  // Check if there was an error
  // data is an object where the key is the id and the value is the place
});
````

##opd-js-sdk Methods

###createClient(options)

####url
The base url to use for the requests. Make sure to include the port if you are running locally.
Default: `www.openplacedatabase.com/api/`

####username
The username to use for authentication. Only required for `deletePlace(s)` and `savePlace(s)`.
Default: `null`

####password
The password to use for authentication. Only required for `deletePlace(s)` and `savePlace(s)`.
Default: `null`

##Client Methods

###getPlace(id, callback(error, data))
Get a place or geojson.
````javascript
opdClient.getPlace('<place id>', function(error, data) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // data is the place object. Mmmm, tasty.
    doAwesomeStuff(data);
  }
});
````

###getPlaces(id, callback(error, data))
Get a place or geojson.
````javascript
var placesIWant = ["<place1>",<place2>",<place3>"];

opdClient.getPlaces(placesIWant, function(error, data) {
  if(error) {
    // Whoops. Lets loop through and see which ones have an error
    console.error(error);
    for(var id in data) {
      var place = data[id];
      // Place will be either an error or an actual place
    }
    
  } else {
    // data is an object where the keys are ids and the values are places
    for(var id in data) {
      var place = data[id];
      consumeMoarPlaces(place);
    }
  }
});
````

###getChanges(from, to, callback(error, data))
Get a place or geojson.
````javascript
// Only get places that have changed  since our last sync time
var from = getLastSyncTime();
// Yup, timestamp magic. Oh yeah.
var to = Date.now();

opdClient.getChanges(from, to, function(error, data) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // data is an object where the keys are ids and the values are places
    for(var id in data) {
      var place = data[id];
      consumeMoarPlaces(place);
    }
  }
});
````
