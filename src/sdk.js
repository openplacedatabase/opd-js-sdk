var request = require('superagent'),
    debug = require('debug')('opd-sdk'),
    geoAssert = require('geojson-assert'),
    querystring = require('querystring'),
    _ = require('underscore')._;

var defaultFrom = '-9999-01-01',
    defaultTo = '9999-12-31';

/******************
 *     client     *
 ******************/
 
/**
 * Constructor
 */ 
var client = function(options){
  options = options || {};
  this.host = options.host ? options.host : 'http://www.openplacedatabase.com';
};

/**
 * Place search
 */
client.prototype.searchPlaces = function(search, options, callback){
  var params = { s: search };
  if(_.isFunction(options)){
    callback = options;
  } else if(_.isObject(options)){
    _.extend(params, options);
  }
  this._get('/api/v0/search/places?' + querystring.stringify(params), callback);
};

/**
 * Get a place by id
 */
client.prototype.getPlace = function(id, callback){
  this._get('/api/v0/places/' + id, callback);
};

/**
 * Get multiple places by id
 */
client.prototype.getPlaces = function(ids, callback){
  if(!_.isArray(ids)){
    throw new Error('ids must be an array of strings');
  }
  this._get('/api/v0/places/' + ids.join(','), callback);
};

/**
 * Get a geojson
 */
client.prototype.getGeoJSON = function(placeId, geojsonId, callback){
  this._get('/api/v0/places/' + placeId + '/' + geojsonId, callback);
};

/**
 * Get multiple geojsons
 */
client.prototype.getGeoJSONs = function(idMap, callback){
  var ids = [];
  _.each(idMap, function(geoIds, placeId){
    _.each(geoIds, function(geoId){
      ids.push(placeId + '/' + geoId);
    });
  });
  debug('getGeoJSONs ids', JSON.stringify(ids));
  this._get('/api/v0/places/' + ids.join(','), callback);
};

/**
 * Get a list of changes during the specified time interval
 */
client.prototype.getChanges = function(from, to, callback){
  this._get('/api/v0/changes?from=' + from + '&to=' + to, callback);
};

/****************************
 * client helpers and utils *
 ****************************/ 

/**
 * Get json from the specified URL
 */
client.prototype._get = function(url, callback){
  request(this.host + url) 
    .end(function(error, response){
      var error = error || response.error;
      var data = response.body && response.body.data ? response.body.data : null;
      if(error || !data) {
        debug(url);
        debug(response.status);
        debug(response.data || response.text);
      }
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