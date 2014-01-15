var sdk = require(__dirname + '/../build/sdk.js'),
    assert = require('assert');
    
var client = sdk.createClient({ host: 'http://openplacedatabase.apiary.io' });
    
describe('sdk', function(){

  it('first', function(done){
    client.getPlace('8fbe18e1-5d04-4b82-a0e9-1c386ed00de7', function(error, place){
      assert.equal(place.id, '8fbe18e1-5d04-4b82-a0e9-1c386ed00de7');
      done();
    });
  });
  
});