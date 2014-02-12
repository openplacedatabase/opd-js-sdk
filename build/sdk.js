function _multiCallback(serverError,serverResponse,callback,interleave,requestedIds){var clientResponse={};_.each(serverResponse,function(data,id){var thisError=serverError;serverError&&200!==data.status.code&&(thisError=new Error(data.status.msgs.join(". ")),thisError.code=data.status.code),clientResponse[id]={error:thisError,data:data.data}}),serverError&&!serverResponse&&_.each(requestedIds,function(id){_.isUndefined(clientResponse[id])&&(clientResponse[id]={error:serverError,data:null})}),interleave&&_.extend(clientResponse,interleave),callback(clientResponse)}function _nextTick(f){setTimeout(f,0)}var request=require("superagent"),debug=require("debug")("opd-sdk"),querystring=require("querystring"),validate=require("opd-validate"),_=require("underscore")._,defaultFrom="-9999-01-01",defaultTo="9999-12-31",client=function(options){options=options||{},this.host=options.host?options.host:"http://www.openplacedatabase.org",this.username=options.username,this.password=options.password};client.prototype.searchPlaces=function(search,options,callback){var params={s:search};_.isFunction(options)?callback=options:_.isObject(options)&&_.extend(params,options),this._get("/api/v0/search/places?"+querystring.stringify(params),callback)},client.prototype.get=function(id,callback){this._get("/api/v0/places/"+id,callback)},client.prototype.getMulti=function(ids,callback){if(!_.isArray(ids))throw new Error("ids must be an array of strings");this._get("/api/v0/places/"+ids.join(","),function(error,response){_multiCallback(error,response,callback,null,ids)})},client.prototype.save=function(id,object,callback){if(!_.isString(id))throw new Error("id must be a string");if(!_.isObject(object))throw new Error("data must be an object");try{-1!==id.indexOf("/")?validate.geojson(object):validate.place(object),this._post("/api/v0/places/"+id,object,callback)}catch(e){callback(e)}},client.prototype.saveMulti=function(objects,callback){var valid={},errors={};_.each(objects,function(object,id){if(!_.isString(id))throw new Error("id must be a string");if(!_.isObject(object))throw new Error("data must be an object");try{-1!==id.indexOf("/")?validate.geojson(object):validate.place(object),valid[id]=object}catch(e){errors[id]={error:e,data:null}}}),this._post("/api/v0/places",valid,function(error,response){_multiCallback(error,response,callback,errors,_.keys(valid))})},client.prototype.delete=function(id,callback){this._delete("/api/v0/places/"+id,callback)},client.prototype.deleteMulti=function(ids,callback){if(!_.isArray(ids))throw new Error("ids must be an array");this._delete("/api/v0/places/"+ids.join(","),function(error,response){_multiCallback(error,response,callback,null,ids)})},client.prototype.getChanges=function(from,to,callback){this._get("/api/v0/changes?from="+from+"&to="+to,callback)},client.prototype._get=function(url,callback){this._request("GET",url,null,callback)},client.prototype._post=function(url,data,callback){this._request("POST",url,data,callback)},client.prototype._delete=function(url,callback){this._request("DELETE",url,null,callback)},client.prototype._request=function(method,url,data,callback){var r=request(method,this.host+url).auth(this.username,this.password).redirects(0);data&&r.send(data),r.end(function(error,response){var response=response||{},error=error||response.error||void 0;3===response.statusType&&(error=new Error("Redirects have been disabled"));var data=response.body&&response.body.data?response.body.data:void 0;debug(url),debug(response.status),debug(response.statusType),debug(response.type),debug(response.data),_nextTick(function(){callback(error,data)})})},module.exports={createClient:function(options){return new client(options)},validate:validate};