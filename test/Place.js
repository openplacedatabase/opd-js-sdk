var sdk = require(__dirname + '/../build/sdk.js'),
    assert = require('assert');

var defaultFrom = '-9999-01-01',
    defaultTo = '9999-12-31',
    otherFrom = '2000-01-01',
    otherTo = '2000-12-31',
    places = {
      'empty': {names:[], sources:[], geojson:[]},
      'name': {
        names: [{
          name: 'foo',
          from: defaultFrom,
          to: defaultTo
        }],
        sources: [],
        geojson: []
      },
      'name-from': {
        names: [{
          name: 'foo',
          from: otherFrom,
          to: defaultTo
        }],
        sources: [],
        geojson: []
      },
      'name-to': {
        names: [{
          name: 'foo',
          from: defaultFrom,
          to: otherTo
        }],
        sources: [],
        geojson: []
      },
      'name-from-to': {
        names: [{
          name: 'foo',
          from: otherFrom,
          to: otherTo
        }],
        sources: [],
        geojson: []
      }
    };
    
describe('Place', function(){

  it('create', function(){
    var place = sdk.createPlace().place();
    assert.deepEqual(place, places['empty']);
  });
  
  it('add name', function(){
    var place = sdk.createPlace().addName('foo').place();
    assert.deepEqual(place, places['name']);
  });
  
  it('add name from', function(){
    var place = sdk.createPlace().addName('foo',otherFrom).place();
    assert.deepEqual(place, places['name-from']);
  });
  
  it('add name to', function(){
    var place = sdk.createPlace().addName('foo',null,otherTo).place();
    assert.deepEqual(place, places['name-to']);
  });
  
  it('add name to', function(){
    var place = sdk.createPlace().addName('foo',otherFrom,otherTo).place();
    assert.deepEqual(place, places['name-from-to']);
  });
  
});