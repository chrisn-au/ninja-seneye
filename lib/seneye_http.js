var stream = require('stream')
  , util = require('util');

var https = require('https');
// Give our device a stream interface
util.inherits(seneye_http,stream);

// Export it
module.exports=seneye_http;




function seneye_http(user, password)
{
  self = this;
   
  this.user = user;
  this.password = password;
  
};
 
seneye_http.prototype.queryDevice = function(device,cb) 
{
    var query = "/v1/devices/"+device+"/exps?user="+this.user+"&pwd="+this.password;
    seneyeCall(cb, query)
       
}

seneye_http.prototype.listDevices = function(cb) 
{   
    var query = "/v1/devices?user="+this.user+"&pwd="+this.password;
    seneyeCall(cb, query)      
 //   var fire.state = false;
}

function seneyeCall(cb,query)
{
   
   var myTimeout = 5000; 
   var header = {"Accept": "application/json"};
    
   var options = {
    host: 'api.seneye.com',
    port: 443,
    path: query,
    method: 'GET',
    headers: header
   }
   
   callback = function(response) {
      var str = '';
      response.on('data', function (chunk) {
      str += chunk;
      
   });

    response.on('socket', function (socket) {
          socket.setTimeout(myTimeout);  
          socket.on('timeout', function() {
          console.log("time out - get seneye");
          // log it and move on hopefully temporary
          response.abort();
          });
    });
    
     response.on('end', function () {
        
        var obj = JSON.parse(str)
        
        if (response.statusCode == 200)
        {
            
           var obj = JSON.parse(str)
           cb(obj);                  
         
         }
        else console.log("Error: seneye "+ response.statusCode ); 
    });
    }
     https.request(options, callback).end();
  }

