var request = require('superagent'),
    debug = require('debug')('opd-sdk'),
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
  this.host = options.host ? options.host : 'http://www.openplacedatabase.org';
  this.username = options.username;
  this.password = options.password;
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
 * Get a place or geojson by id
 */
client.prototype.get = function(id, callback){
  this._get('/api/v0/places/' + id, callback);
};

/**
 * Get multiple places or geojsons by id
 */
client.prototype.getMulti = function(ids, callback){
  if(!_.isArray(ids)){
    throw new Error('ids must be an array of strings');
  }
  this._get('/api/v0/places/' + ids.join(','), callback);
};

/**
 * Create or update a place or geojson
 */
client.prototype.save = function(id, place, callback){
  if(!_.isString(id)){
    throw new Error('place id must be a string');
  }
  if(!_.isObject(place)){
    throw new Error('place must be an object');
  }
  this._post('/api/v0/places/' + id, place, callback);
};

/**
 * Create or update multiple places or geojsons
 */
client.prototype.saveMulti = function(places, callback){
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
 * Delete a place or geojson
 */
client.prototype.delete = function(id, callback){
  this._delete('/api/v0/places/' + id, callback);
};

/**
 * Delete multiple places or geojsons
 */
client.prototype.deleteMulti = function(ids, callback){
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

/**
 * Get a list of changes during the specified time interval
 */
client.prototype.getChanges = function(from, to, callback){
  this._get('/api/v0/changes?from=' + from + '&to=' + to, callback);
};

/****************************
 *    helpers and utils     *
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