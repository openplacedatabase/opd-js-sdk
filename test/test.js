var sdk = require(__dirname + '/../build/sdk.js'),
    debug = require('debug')('opd-sdk-test'),
    _ = require('underscore')._,
    assert = require('assert'),
    fs = require('fs');
    
var nock = require('nock')('http://www.openplacedatabase.com').defaultReplyHeaders({'Content-Type':'application/json'});
var client = sdk.createClient();
    
describe('sdk', function(){

  it('searchPlaces', function(done){
    var scope = getNockScope('/api/v0/search/places?s=England');
    client.searchPlaces('England', function(error, data){
      assert.equal(data.total, 28);
      assert.equal(data.results.length, 10);
      assert.equal(data.results[0].id, '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
      scope.done();
      done();
    });
  });

  it('searchPlaces count 5', function(done){
    var scope = getNockScope('/api/v0/search/places?s=England&count=5');
    client.searchPlaces('England', { count: 5 }, function(error, data){
      assert.equal(data.total, 28);
      assert.equal(data.results.length, 5);
      assert.equal(data.results[0].id, '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
      scope.done();
      done();
    });
  });
  
  it('searchPlaces offset 25', function(done){
    var scope = getNockScope('/api/v0/search/places?s=England&offset=25');
    client.searchPlaces('England', { offset: 25 }, function(error, data){
      assert.equal(data.total, 28);
      assert.equal(data.results.length, 3);
      assert.equal(data.results[0].id, '8ea15391-0096-4a6b-8885-7d3154f6cd98');
      scope.done();
      done();
    });
  });

  it('getPlace', function(done){
    var scope = getNockScope('/api/v0/places/8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
    client.getPlace('8fbe18e1-5d04-4b82-a0e9-1c386ed00de7', function(error, place){
      assert(_.isUndefined(error));
      assert.equal(place.id, '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
      scope.done();
      done();
    });
  });
  
  it('getPlace 404', function(done){
    var scope = nock.get('/api/v0/places/foo').reply(404, '');
    client.getPlace('foo', function(error, place){
      assert(!_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  it('getPlaces', function(done){
    var ids = ['8fbe18e1-5d04-4b82-a0e9-1c386ed00de7','d8e30c45-9470-49d3-ac9d-e7f7b7b2e1ba'],
        scope = getNockScope('/api/v0/places/' + ids.join(','));
    client.getPlace(ids, function(error, places){
      assert.equal(places[ids[0]].data.id, ids[0]);
      assert.equal(places[ids[1]].data.id, ids[1]);
      scope.done();
      done();
    });
  });
  
  it('getPlaces invalid ids parameter', function(){
    assert.throws(function(){
      client.getPlaces('', function(){});
    });
  });
  
  it('savePlace', function(done){
    var postData = {
      "id":"a90af1cb-7e45-4235-aac0-fabf0233edb9",
      "version":1,
      "names":[],
      "sources":[],
      "geojsons":[]
    };
    var scope = postNockScope('/api/v0/places/a90af1cb-7e45-4235-aac0-fabf0233edb9', postData, 200);
    client.savePlace('a90af1cb-7e45-4235-aac0-fabf0233edb9', postData, function(error){
      assert(_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  it('savePlace 400', function(done){
    var scope = postNockScope('/api/v0/places/bad', {id:'bad'}, 400);
    client.savePlace('bad', {id:'bad'}, function(error){
      assert(!_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  if('savePlaces', function(done){
    var postData = {
      "a90af1cb-7e45-4235-aac0-fabf0233edb9": {
        "id":"bad id",
        "version":1,
        "names":[],
        "sources":[],
        "geojsons":[]
      },
      "d8e35c45-9470-49d3-ac9d-e7f7b7b2e1ba": {
        "id":"d8e35c45-9470-49d3-ac9d-e7f7b7b2e1ba",
        "version":1,
        "names":[],
        "sources":[],
        "geojsons":[]
      }
    };
    var scope = postNockScope('/api/v0/places', postData);
    client.savePlaces(postData, function(error, data){
      assert(!data['a90af1cb-7e45-4235-aac0-fabf0233edb9']);
      assert(data['d8e35c45-9470-49d3-ac9d-e7f7b7b2e1ba']);
      scope.done();
      done();
    });
  });
  
  it('deletePlace', function(done){
    var scope = deleteNockScope('/api/v0/places/a90af1cb-7e45-4235-aac0-fabf0233edb9');
    client.deletePlace('a90af1cb-7e45-4235-aac0-fabf0233edb9', function(error){
      assert(_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  it('deletePlaces', function(done){
    var ids = ['a90af1cb-7e45-4235-aac0-fabf0233edb9','d8e35c45-9470-49d3-ac9d-e7f7b7b2e1ba'];
    var scope = deleteNockScope('/api/v0/places/' + ids.join(','));
    client.deletePlaces(ids, function(error, data){
      assert(data['a90af1cb-7e45-4235-aac0-fabf0233edb9']);
      assert(data['d8e35c45-9470-49d3-ac9d-e7f7b7b2e1ba']);
      scope.done();
      done();
    });
  });
  
  it('getGeoJSON', function(done){
    var scope = getNockScope('/api/v0/places/8fbe18e1-5d04-4b82-a0e9-1c386ed00de7/1');
    client.getGeoJSON('8fbe18e1-5d04-4b82-a0e9-1c386ed00de7', 1, function(error, geojson){
      assert.equal(geojson.type, 'Polygon');
      assert.equal(geojson.coordinates.length, 1);
      assert.equal(geojson.coordinates[0].length, 5);
      scope.done();
      done();
    });
  });
  
  it('getGeoJSONs', function(done){
    var ids = {
      '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7': [1],
      'd8e30c45-9470-49d3-ac9d-e7f7b7b2e1ba': [1]
    };
    var scope = getNockScope('/api/v0/places/8fbe18e1-5d04-4b82-a0e9-1c386ed00de7/1,d8e30c45-9470-49d3-ac9d-e7f7b7b2e1ba/1');
    client.getGeoJSONs(ids, function(error, geojsons){
      assert(_.isObject(geojsons['8fbe18e1-5d04-4b82-a0e9-1c386ed00de7/1']));
      assert(_.isObject(geojsons['d8e30c45-9470-49d3-ac9d-e7f7b7b2e1ba/1']));
      scope.done();
      done();
    });
  });
  
  it('saveGeoJSON', function(done){
    var geojson = {
      "type":"Point",
      "coordinates":[0,0]
    };
    var scope = postNockScope('/api/v0/places/a90af1cb-7e45-4235-aac0-fabf0233edb/1');
    client.saveGeoJSON('a90af1cb-7e45-4235-aac0-fabf0233edb', '1', geojson, function(error){
      assert(_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  // This is just testing that the post data is properly
  // formatted because the url conflicts with savePlaces
  // so we can't really test the format of the response
  it('saveGeoJSONs', function(done){
    var geos = {
      "a90af1cb-7e45-4235-aac0-fabf0233edb": {
        "1": {
          "type":"Point",
          "coordinates":[0,0]
        },
        "2": {
          "type":"Point",
          "coordinates":[1,1]
        }
      }
    };
    var postData = {
      "a90af1cb-7e45-4235-aac0-fabf0233edb/1": {
        "type":"Point",
        "coordinates":[0,0]
      },
      "a90af1cb-7e45-4235-aac0-fabf0233edb/2": {
        "type":"Point",
        "coordinates":[1,1]
      }
    };
    var scope = postNockScope('/api/v0/places', postData);
    client.saveGeoJSONs(geos, function(error, response){
      assert(_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  it('deleteGeoJSON', function(done){
    var scope = deleteNockScope('/api/v0/places/a90af1cb-7e45-4235-aac0-fabf0233edb9/1');
    client.deleteGeoJSON('a90af1cb-7e45-4235-aac0-fabf0233edb9', '1', function(error){
      assert(_.isUndefined(error));
      scope.done();
      done();
    });
  });
  
  it('deleteGeoJSONs', function(done){
    var scope = deleteNockScope('/api/v0/places/a90af1cb-7e45-4235-aac0-fabf0233edb9/1,a90af1cb-7e45-4235-aac0-fabf0233edb9/2');
    client.deleteGeoJSONs({'a90af1cb-7e45-4235-aac0-fabf0233edb9':['1','2']}, function(error, data){
      assert(data['a90af1cb-7e45-4235-aac0-fabf0233edb9/1']);
      assert(data['a90af1cb-7e45-4235-aac0-fabf0233edb9/2']);
      scope.done();
      done();
    });
  });
  
  it('getChanges', function(done){
    var scope = getNockScope('/api/v0/changes?from=1389710140336&to=1389724640538');
    client.getChanges(1389710140336, 1389724640538, function(error, changes){
      assert.equal(changes.length, 6);
      assert.equal(changes[0].timestamp, 1389710140336);
      assert.equal(changes[5].timestamp, 1389724640538);
      assert.equal(changes[0].id, '790af1cb-7e45-4235-aac0-fabf0233edb9');
      scope.done();
      done();
    });
  });

});

/**
 * Helper functions for getting a nock scope
 */

function getNockScope(url, status){
  return nockScope('GET', url, status);
};

function postNockScope(url, data, status){
  return nockScope('POST', url, status, data);
};

function deleteNockScope(url, status){
  return nockScope('DELETE', url, status);
};

function nockScope(method, url, status, body){
  if(_.isUndefined(status)){
    status = 200;
  }
  return nock.intercept(url, method, body).reply(status,  function(url, requestBody){
    var filename = __dirname + '/responses/' + method + '_' + url.replace(/^\//,'').replace(/[\/\?&=]/g,'_') + '.json';
    debug(filename);
    return fs.createReadStream(filename);
  });
};