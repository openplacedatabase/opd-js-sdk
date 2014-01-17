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
  this.username = options.username;
  this.password = options.password;
};

/******************
 *     places     *
 ******************/

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
 * Create a place
 */
client.prototype.savePlace = function(id, place, callback){
  if(!_.isString(id)){
    throw new Error('place id must be a string');
  }
  if(!_.isObject(place)){
    throw new Error('place must be an object');
  }
  this._post('/api/v0/places/' + id, place, callback);
};

/**
 * Create multiple places
 */
client.prototype.savePlaces = function(places, callback){
  _.each(places, function(place, id){
    if(!_.isString(id)){
      throw new Error('place id must be a string');
    }
    if(!_.isObject(place)){
      throw new Error('place must be an object');
    }
  });
  this._post('/api/v0/places', places, function(error, response){
    var ids = {};
    _.each(response, function(data, id){
      ids[id] = data.status.code === 200;
    });
    callback(error, ids);
  });
};

/**
 * Delete place
 */
client.prototype.deletePlace = function(id, callback){
  this._delete('/api/v0/places/' + id, callback);
};

/**
 * Delete multiple places
 */
client.prototype.deletePlaces = function(ids, callback){
  if(!_.isArray(ids)) {
    throw new Error('ids must be an array');
  }
  this._delete('/api/v0/places/' + ids.join(','), function(error, response){
    var ids = {};
    _.each(response, function(data, id){
      ids[id] = data.status.code === 200;
    });
    callback(error, ids);
  });
};

/******************
 *    geojson     *
 ******************/

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
 * Save a geojson
 */
client.prototype.saveGeoJSON = function(placeId, geojsonId, geojson, callback){
  this._post('/api/v0/places/' + placeId + '/' + geojsonId, geojson, callback);
};

/**
 * Save multiple geojsons
 */
client.prototype.saveGeoJSONs = function(geojsons, callback){
  var postData = {};
  _.each(geojsons, function(geos, placeId){
    _.each(geos, function(geo, geoId){
      postData[placeId+'/'+geoId] = geo;
    });
  });
  this._post('/api/v0/places', postData, callback);
};

/**
 * Delete a geojson
 */
client.prototype.deleteGeoJSON = function(placeId, geojsonId, callback){
  this._delete('/api/v0/places/' + placeId + '/' + geojsonId, callback);
};

/**
 * Delete multiple geojsons
 */
client.prototype.deleteGeoJSONs = function(idMap, callback){
  var ids = [];
  _.each(idMap, function(geoIds, placeId){
    _.each(geoIds, function(geoId){
      ids.push(placeId + '/' + geoId);
    });
  });
  this._delete('/api/v0/places/' + ids.join(','), callback);
};

/******************
 *    changes     *
 ******************/

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
 * GET the specified url
 */
client.prototype._get = function(url, callback){
  this._request('GET', url, null, callback);
};

/**
 * POST to the specified url
 */
client.prototype._post = function(url, data, callback){
  this._request('POST', url, data, callback);
};

/**
 * DELETE the specified url
 */
client.prototype._delete = function(url, callback){
  this._request('DELETE', url, null, callback);
};

/**
 * Generic function for HTTP requests
 */
client.prototype._request = function(method, url, data, callback){
  var r = request(method, this.host + url).auth(this.username, this.password);
  if(data){
    r.send(data);
  }
  r.end(function(error, response){
    var response = response || {};
    var error = error || response.error || undefined;
    var data = response.body && response.body.data ? response.body.data : undefined;
    if(error) {
      debug(url);
      debug(response.status);
      debug(response.data || response.text);
    }
    _nextTick(function(){ callback(error, data); });
  });
};
 
/**
 * Call the function on the next tick.
 * Best to call callbacks this way so
 * they get a new stack
 */ 
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