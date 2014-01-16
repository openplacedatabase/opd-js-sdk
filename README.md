#opd-sdk

The javascript sdk for the Open Place Database API

##Install

`npm install opd-sdk --save`

###Requiring

````javascript
var opdSDK = require('opd-sdk'),
    opdClient = opdSDK.createClient();
````

Again, but with options

````javascript
var opdSDK = require('opd-sdk'),
    opdClient = opdSDK.createClient({
      host: 'localhost:8080'
    });
````

## Notes
* All returned or thrown errors are standard javascript error objects created via `new Error('message here')`
* This library uses the `debug` module (found [here](https://npmjs.org/package/debug)). To enable it, set the `DEBUG` environment variable to `opd-sdk` (`DEBUG=opd-sdk`)
* To view the schemas for places and geojsons, go [here](https://github.com/openplacedatabase/www).

## Methods

###createClient(options)
````javascript
// Overwrite ALL the options. Bwahahahaha.
var opdSDK = require('opd-sdk'),
    opdClient = opdSDK.createClient({
      url:'http://localhost:8080/api',
      username:'nananananananananananananananana',
      password: 'BATMAAAN'
    });
````

####url
The base url to use for the requests. Make sure to include the port if you are running locally.
Default: `http://www.openplacedatabase.com/api/`

####username
The username to use for authentication. Only required for `deletePlace(s)` and `savePlace(s)`.
Default: `null`

####password
The password to use for authentication. Only required for `deletePlace(s)` and `savePlace(s)`.
Default: `null`

##Client Methods

###searchPlaces(query, [options], callback(error, data))
Find some historical places. Booyah. Note that `options` is optional.
````javascript
var options = {
  count: 42, // Must be between 1 and 100, default 10
  offset: 76 // Must be an integer > 0, default 0
};

opdClient.searchPlaces("Essex County, England", options, function(error, data) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // data is an object with 2 keys, results and total
    console.log('We found this many results:',data.total);
    for(var x in data.results) {
      var place = data.results[x];
    }
  }
});
````

###getPlace(id, callback(error, data))
Get a place.
````javascript
opdClient.getPlace("<place id>", function(error, data) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // data is the place object. Mmmm, tasty.
    doAwesomeStuff(data);
  }
});
````

###getPlaces(places, callback(error, data))
Get several places.
````javascript
var placesIWant = ["<place1>","<place2>","<place3>"];

opdClient.getPlaces(placesIWant, function(error, data) {
  if(error) {
    // Whoops. Lets loop through and see which ones have an error
    console.error(error);
    for(var id in data) {
      // Place will be either be null or an actual place
      var place = data[id];
    }
  } else {
    // data is an object where the keys are ids and the values are places
    for(var id in data) {
      var place = data[id];
      consumeMoarPlaces(place);
    }

    // We can also directly access the place we want
    var thisOne = data[placeId];

  }
});
````

###savePlace(id, place, callback(error))
Save a place
````javascript
opdClient.savePlace("<placeId>",place, function(error) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // Save successful. Time for pie.
  }
});
````

###savePlaces(places, callback(error, data))
Save multiple places at once
````javascript
var places = {
  '<place1>': placeOneObject,
  '<place2>': placeTwoObject
};

opdClient.savePlaces(places, function(error, data) {
  if(error) {
    // Whoops. data has a key for every id, and a true|false if the save was successful
    for(var id in data) {
      if(data[id] === true) {
        // We successfullly saved this one
      } else {
        // We had better retry this one
        retries.push(id);
      }
    }
    console.error(error);
  } else {
    // Save successful. The data is saved, nap time.
  }
});
````

###deletePlace(id, callback(error))
Delete a place
````javascript
opdClient.deletePlace("<placeId>", function(error) {
  if(error) {
    // Whoops, that didn't go as planned.
    console.error(error);
  } else {
    // The place is no more. :(
  }
});
````

###deletePlaces(places, callback(error))
delete multiple places
````javascript
var places = [
  '<place1>',
  '<place2>'
];

opdClient.deletePlaces(places, function(error, data) {
  if(error) {
    // Whoops. data has a key for every id, and a true|false if the delete was successful
    for(var id in data) {
      if(data[id] === true) {
        // We successfullly deleted this one
      } else {
        // We had better retry this one
        retries.push(id);
      }
    }
    console.error(error);
  } else {
    // Delete successful. Why are you deleting this place anyway?
  }
});
````

###getGeoJSON(placeId, geoJSONId, callback(error, data))
Get a place's GeoJSON.
````javascript
opdClient.getGeoJSON("<placeId>", "<geojsonId>" function(error, data) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // data is the geojson object. Boundaries incoming.
    displayGeoJSON(data);
  }
});
````

###getGeoJSONs(id, callback(error, data))
Get several places.
````javascript
var geoJSONsIWant = {
  "<place1>":["<geojson1>"],
  "<place2>":["<geojson1>","<geojson2>"]
};

opdClient.getGeoJSONs(geoJSONsIWant, function(error, data) {
  if(error) {
    // Whoops. Lets loop through and see which ones have an error
    console.error(error);
    for(var placeId in data) {
      var geojsons = data[placeId];
      for(var geojsonId in geojsons) {
        // geojson will either be an object or null
        var geojson = geojsons[geojsonId];
        reportError(placeId, geojsonId);
      }
    }
  } else {
    // data is an object where the keys are ids and the values are places
    for(var placeId in data) {
      var geojsons = data[placeId];
      for(var geojsonId in geojsons) {
        var geojson = geojsons[geojsonId];
        letGeoJSONGoFree(geojson);
      }
    }

    // We can also directly access the gejson we want
    var thisOne = data[placeId][geojsonId];

  }
});
````

###saveGeoJSON(placeId, geojsonId, geoJSON, callback(error))
Save a geoJSON
````javascript
opdClient.saveGeoJSON("<placeId>", "<geojsonId>", geoJSON, function(error) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // Save successful. Boundaries updated.
  }
});
````

###saveGeoJSONs(geojsons, callback(error, data))
Save multiple places at once
````javascript
var geojsons = {
  '<place1>': {
    '<geojson1>': geojsonOne
  },
  '<place2>': {
    '<geojson1>': geojsonOne,
    '<geojson2>': geojsonTwo
  }
};

opdClient.saveGeoJSONs(geojsons, function(error, data) {
  if(error) {
    // Whoops. data has a key for every place id, and each place id
    // is an object with keys for geojson ids and values of true|false
    console.error(error);
    for(var placeId in data) {
      var geojsons = data[placeId];
      for(var geojsonId in geojsons) {
        // geojson will either be true or false
        if(!geojsons[geojsonId]) {
          reportFailureToCaptian(placeId, geojsonId);
        }
      }
    }
  } else {
    // Save successful. Safe....
  }
});
````

###deleteGeoJSON(placeId, geojsonId, callback(error))
Delete a geojson
````javascript
opdClient.deleteGeoJSON("<placeId>","<geojsonId>", function(error) {
  if(error) {
    // Whoops, that didn't go as planned.
    console.error(error);
  } else {
    // The geojson has been obliterated. Time to go home.
  }
});
````

###deleteGeoJSONs(geojsons, callback(error))
delete multiple geojsons
````javascript
var geojsons = {
  '<place1>': ['<geojson1>'],
  '<place2>': ['<geojson1>','<geojson2>']
};

opdClient.deletePlaces(geojsons, function(error, data) {
  if(error) {
    // Whoops. data has a key for every place id, and each place id
    // is an object with keys for geojson ids and values of true|false
    console.error(error);
    for(var placeId in data) {
      var geojsons = data[placeId];
      for(var geojsonId in geojsons) {
        // geojson will either be true or false
        if(!geojsons[geojsonId]) {
          unableToDelete(placeId, geojsonId);
        }
      }
    }
  } else {
    // Delete successful. You just destroyed some data.
  }
});
````

###getChanges(from, to, callback(error, data))
Get changes for a given time range.
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