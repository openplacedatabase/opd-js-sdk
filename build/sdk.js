function _nextTick(f){setTimeout(f,0)}var request=require("superagent"),debug=require("debug")("opd-sdk"),geoAssert=require("geojson-assert"),querystring=require("querystring"),_=require("underscore")._,defaultFrom="-9999-01-01",defaultTo="9999-12-31",client=function(options){options=options||{},this.host=options.host?options.host:"http://www.openplacedatabase.com"};client.prototype.searchPlaces=function(search,options,callback){var params={s:search};_.isFunction(options)?callback=options:_.isObject(options)&&_.extend(params,options),this._get("/api/v0/search/places?"+querystring.stringify(params),callback)},client.prototype.getPlace=function(id,callback){this._get("/api/v0/places/"+id,callback)},client.prototype.getPlaces=function(ids,callback){if(!_.isArray(ids))throw new Error("ids must be an array of strings");this._get("/api/v0/places/"+ids.join(","),callback)},client.prototype.savePlace=function(id,place,callback){if(!_.isString(id))throw new Error("place id must be a string");if(!_.isObject(place))throw new Error("place must be an object");this._post("/api/v0/places/"+id,place,callback)},client.prototype.savePlaces=function(places,callback){_.each(places,function(place,id){if(!_.isString(id))throw new Error("place id must be a string");if(!_.isObject(place))throw new Error("place must be an object")}),this._post("/api/v0/places",places,function(error,response){var ids={};_.each(response,function(data,id){ids[id]=200===data.status.code}),callback(error,ids)})},client.prototype.deletePlace=function(id,callback){this._delete("/api/v0/places/"+id,callback)},client.prototype.getGeoJSON=function(placeId,geojsonId,callback){this._get("/api/v0/places/"+placeId+"/"+geojsonId,callback)},client.prototype.getGeoJSONs=function(idMap,callback){var ids=[];_.each(idMap,function(geoIds,placeId){_.each(geoIds,function(geoId){ids.push(placeId+"/"+geoId)})}),debug("getGeoJSONs ids",JSON.stringify(ids)),this._get("/api/v0/places/"+ids.join(","),callback)},client.prototype.getChanges=function(from,to,callback){this._get("/api/v0/changes?from="+from+"&to="+to,callback)},client.prototype._get=function(url,callback){this._request("GET",url,null,callback)},client.prototype._post=function(url,data,callback){this._request("POST",url,data,callback)},client.prototype._delete=function(url,callback){this._request("DELETE",url,null,callback)},client.prototype._request=function(method,url,data,callback){var r=request(method,this.host+url);data&&r.send(data),r.end(function(error,response){var error=error||response.error||void 0,data=response.body&&response.body.data?response.body.data:void 0;error&&(debug(url),debug(response.status),debug(response.data||response.text)),_nextTick(function(){callback(error,data)})})},module.exports={createClient:function(options){return new client(options)}};