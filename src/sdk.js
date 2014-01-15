var request = require('superagent'),
    geoAssert = require('geojson-assert');

var defaultFrom = '-9999-01-01',
    defaultTo = '9999-12-31';

/******************
 *     Client
 ******************/
var Client = function(options){

};

/******************
 *     Utils
 ******************/
 
function _isString(string){
  return Object.prototype.toString.call(string) == '[object String]';
};
 
function _isUndefined(obj){
  return typeof obj === 'undefined';
};
 
function _isObject(obj) {
  return obj === Object(obj);
};

/**
 * Exports
 */
module.exports = {
  createClient: function(options){
    return new Client(options);
  }
};