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
 *     Place
 ******************/
var Place = function(){
  this.names = [];
  this.geojsons = [];
  this.sources = [];
};

Place.prototype.addName = function(name, from, to){
  if(!_isString(name)){
    throw new Error('name must be a string');
  }
  if(!from){
    from = defaultFrom;
  }
  if(!to){
    to = defaultTo;
  }
  this.names.push({
    name: name,
    from: from,
    to: to
  });
  return this;
};

Place.prototype.addGeoJSON = function(geojson, from, to){
  if(!_isObject(geojson)){
    throw new Error('geojson must be an object');
  }
  geoAssert(geojson);
  if(geojson.type == 'FeatureCollection' || geojson.type == 'Feature'){
    throw new Error('Features are not supported');
  }
  if(!from){
    from = defaultFrom;
  }
  if(!to){
    to = defaultTo;
  }
  this.geojsons.push({
    geojson: geojson,
    from: from,
    to: to
  });
  return this;
};

Place.prototype.addSource = function(source){
  if(!_isString(source)){
    throw new Error('source must be a string');
  }
  this.sources.push(source);
  return this;
};

Place.prototype.place = function(){
  return {
    names: this.names,
    geojson: this.geojsons,
    sources: this.sources
  };
};

Place.prototype.geoJSON = function(){
  return this.geojsons;
};

Place.prototype.save = function(client, callback){
  throw new Error('not implemented');
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
  },
  createPlace: function(){
    return new Place()
  }
};