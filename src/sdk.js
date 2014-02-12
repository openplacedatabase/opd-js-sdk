var request = require('superagent'),
    debug = require('debug')('opd-sdk'),
    querystring = require('querystring'),
    validate = require('opd-validate'),
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
  this._get('/api/v0/places/' + ids.join(','), function(error, response){
    _multiCallback(error, response, callback);
  });
};

/**
 * Create or update a place or geojson
 */
client.prototype.save = function(id, object, callback){
  if(!_.isString(id)){
    throw new Error('id must be a string');
  }
  if(!_.isObject(object)){
    throw new Error('data must be an object');
  }
  try {
    if(id.indexOf('/') !== -1){
      validate.geojson(object);
    } else {
      validate.place(object);
    }
    this._post('/api/v0/places/' + id, object, callback);
  } catch(e) {
    callback(e);
  }
};

/**
 * Create or update multiple places or geojsons
 */
client.prototype.saveMulti = function(objects, callback){
  
  // Validate objects. Seperate invalid ones from the
  // valide ones. Send valid ones to server and interleave
  // invalid ones with the results.
  var valid = {}, errors = {};
  _.each(objects, function(object, id){
    if(!_.isString(id)){
      throw new Error('id must be a string');
    }
    if(!_.isObject(object)){
      throw new Error('data must be an object');
    }
    try {
      if(id.indexOf('/') !== -1){
        validate.geojson(object);
      } else {
        validate.place(object);
      }
      valid[id] = object;
    } catch(e) {
      errors[id] = {
        error: e,
        data: null
      };
    }
  });

  this._post('/api/v0/places', valid, function(error, response){
    _multiCallback(error, response, callback, errors);
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
    _multiCallback(error, response, callback);
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
  var r = request(method, this.host + url).auth(this.username, this.password).redirects(0);
  if(data){
    r.send(data);
  }
  r.end(function(error, response){
    var response = response || {};
    // response.error is an error object when the HTTP
    // status code is a 4xx or 5xx
    var error = error || response.error || undefined;
    if(response.statusType === 3){
      error = new Error('Redirects have been disabled');
    }
    var data = response.body && response.body.data ? response.body.data : undefined;
    debug(url);
    debug(response.status);
    debug(response.statusType);
    debug(response.type);
    debug(response.data);
    _nextTick(function(){ callback(error, data); });
  });
};

/**
 * Callback used by Multi methods that
 * generates the proper response format
 */
function _multiCallback(serverError, serverResponse, callback, interleave){
  var clientResponse = {};
  _.each(serverResponse, function(data, id){
    var thisError = serverError;
    if(!thisError && data.status.code !== 200){
      thisError = new Error(data.status.msgs.join('. '));
      thisError.code = data.status.code;
    }
    clientResponse[id] = {
      error:  thisError,
      data: data.data
    };
  });
  if(interleave){
    _.extend(clientResponse, interleave);
  }
  callback(clientResponse);
}
 
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
  },
  validate: validate
};