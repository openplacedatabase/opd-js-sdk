var sdk = require(__dirname + '/../build/sdk.js'),
    assert = require('assert');
    
var client = sdk.createClient({ host: 'http://openplacedatabase.apiary.io' });
    
describe('sdk', function(){

  it('searchPlaces', function(done){
    client.searchPlaces('England', { count: 15 }, function(error, data){
      assert.equal(data.total, 28);
      assert.equal(data.results.length, 10);
      assert.equal(data.results[0].id, '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
      done();
    });
  });

  it('getPlace', function(done){
    client.getPlace('8fbe18e1-5d04-4b82-a0e9-1c386ed00de7', function(error, place){
      assert.equal(place.id, '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
      done();
    });
  });
  
});