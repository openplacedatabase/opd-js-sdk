#opd-js-sdk

The javascript sdk for the Open Place Database API

##Install

##Examples

###requiring
````
var opdSDK = require('opd-js-sdk'),
    opdClient = opdSDK.createClient();
````

###get a place
````
opdClient.getPlace('<place id>', function(error, data) {
  // Check if there was an error
  // data is the place
});
````

###get many places
````
var placesIWant = ["<place1>",<place2>",<place3>"];

opdClient.getPlaces(placesIWant, function(error, data) {
  // Check if there was an error
  // data is an object where the key is the id and the value is the place
});
````

##opd-js-sdk Methods

###opd-js-sdk



##Client Methods

