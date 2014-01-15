var request = require('superagent'),
    debug = require('debug')('opd-sdk'),
    geoAssert = require('geojson-assert');

var defaultFrom = '-9999-01-01',
    defaultTo = '9999-12-31';

/******************
 *     client
 ******************/
var client = function(options){
  this.host = options.host ? options.host : 'http://openplacedatabase.com';
};

/**
 * Get a place by id
 */
client.prototype.getPlace = function(id, callback){
  request(this.host + '/api/v0/places/' + id) 
    .end(function(error, response){
      if(error || response.error) {
        debug(response.data || response.text);
      }
      var data = response.body && response.body.data ? response.body.data : null;
      _nextTick(function(){ callback(error, data); });
    });
};

function _nextTick(f){
  setTimeout(f, 0);
};

/**
 * Exports
 */
module.exports = {
  createClient: function(options){
    return new client(options);
  }
};