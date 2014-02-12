#opd-sdk

The javascript sdk for the Open Place Database API

[![NPM version](https://badge.fury.io/js/opd-sdk.png)](http://badge.fury.io/js/opd-sdk)

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
      host:'http://localhost:8080/api',
      username:'nananananananananananananananana',
      password: 'BATMAAAN'
    });
````

* __host__: The base url to use for the requests. Make sure to include the port if you are running locally.
Default: `http://www.openplacedatabase.com/api/`

* __username__: The username to use for authentication. Only required for `deletePlace(s)` and `savePlace(s)`.
Default: `null`

* __password__: The password to use for authentication. Only required for `deletePlace(s)` and `savePlace(s)`.
Default: `null`

###validate

Validate OPD data via the [opd-validate](https://github.com/openplacedatabase/validate) library. Read it's docs for more information.

````javascript
var opdSDK = require('opd-sdk');

try {
  opdSDK.validate.place(placeObj);
  opdSDK.validate.geojson(geojson);
} catch(e) {
  // Validation failed
}
````

## Client Methods

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

###get(id, callback(error, data))

Get a place or geojson.

````javascript
opdClient.get("<place id>", function(error, data) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // data is the place object. Mmmm, tasty.
    doAwesomeStuff(data);
  }
});
````

###getMulti(ids, callback(error, data))

Get several places or geojson.

````javascript
var stuffIWant = ["<place1>","<place2>","<geojsonId>"];

opdClient.getMulti(stuffIWant, function(response) {
  // Response will be an object with keys matching
  // the requested ids. The values will be {error, data}
  // objects.
  for(var id in data) {
    // The error property will either be
    // an Error objects or null
    if(data[id].error){
      handleError(id, data[id].error);
    } else {
      doStuff(id, data[id].data);
    }
  }
});
````

###save(id, place, callback(error))

Save a place or geojson

````javascript
opdClient.save("<id>", data, function(error) {
  if(error) {
    // Whoops.
    console.error(error);
  } else {
    // Save successful. Time for pie.
  }
});
````

###saveMulti(places, callback(error, data))

Save multiple places or geojsons at once

````javascript
var dataToSave = {
  '<place1>': placeOneObject,
  '<place2>': placeTwoObject,
  '<geojsonid1>': geojsonObject
};

opdClient.saveMulti(dataToSave, function(response) {
  // Response will be an object with keys matching
  // the requested ids. The values will be {error, data}
  // objects.
  for(var id in data) {
    // The error property will either be
    // an Error objects or null
    if(data[id].error){
      // Save failed
    } else {
      // Save successfull
    }
  }
});
````

###delete(id, callback(error))

Delete a place

````javascript
opdClient.delete("<placeId>", function(error) {
  if(error) {
    // Whoops, that didn't go as planned.
    console.error(error);
  } else {
    // The place is no more. :(
  }
});
````

###deleteMulti(places, callback(error))

Delete multiple places or geojsons

````javascript
var places = [
  '<place1>',
  '<place2>'
];

opdClient.deleteMulti(places, function(error, data) {
  // Response will be an object with keys matching
  // the requested ids. The values will be {error, data}
  // objects.
  for(var id in data) {
    // The error property will either be
    // an Error objects or null
    if(data[id].error){
      // Delete failed
    } else {
      // Delete successfull
    }
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
