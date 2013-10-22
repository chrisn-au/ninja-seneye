var stream = require('stream')
  , dgram = require('dgram') 
  , util = require('util');

// Give our device a stream interface
util.inherits(escea_udp,stream);

// Export it
module.exports=escea_udp;




function escea_udp()
{
  self = this;
   
  this.client = dgram.createSocket('udp4');
  
  this.client.bind(3300); 
  this.client.setBroadcast(true);
  
   self.client.on("message", function (msg, rinfo) {
                  
                  if (msg[1] == 0x90)
                  {
                        console.log("got: Fire message from " + rinfo.address);
                        console.log("got serial "+ msg.readUInt32BE(3,false)); 
                        console.log("got pin "+ msg.readUInt16BE(7,false));
                        self.ipaddress = rinfo.address;
                        self.discovercb(msg.readUInt32BE(3,false));
                   } 
                   if (msg[1] == 0x80)
                   {
                        console.log("Fire Status " + msg[4]);
                        console.log("Desired temp " + msg[7]);
                        console.log("Room temp " + msg[8]);
                        self.queryfirecb(msg[4],msg[8],msg[7]); 
                   }    
                   if (msg[1] == 0x8D)
                   {
                      console.log("Powered On");
                      self.controlfirecb(true);
                   }
                   if (msg[1] == 0x8F)
                   {
                    console.log("Powered Off");
                    self.controlfirecb(false);
                   }             
      });

  
};

escea_udp.prototype.processMessage = function(ipa,message,cb)
{
     self - this;
    
      self.client.send(message, 0, message.length, 3300, ipa, function(err, bytes)
          {
                if(err) throw err;
          });      
     
}
escea_udp.prototype.discover = function(cb)
{
   var self = this;
   var ip = "192.168.0.255";
   var message = new Buffer(16);
   
   message[0] = 0x47; 
   message[1] = 0x50;
     for(var i = 2; i < 14;i++) { message[i] = 0x00; }
   message[14] = 0x50;
   message[15] = 0x46;   
   this.discovercb = cb;
   this.processMessage(ip,message,cb);   
};

 
escea_udp.prototype.queryfire = function(fire,cb) 
{
    var self = this;
    var message = new Buffer(16);
    message[0] = 0x47; 
    message[1] = 0x31;
      for(var i = 2; i < 14;i++) { message[i] = 0x00; }
    message[14] = 0x31;
    message[15] = 0x46;  
    this.queryfirecb = cb;
    this.processMessage(this.ipaddress,message,cb)
      
 //   var fire.state = false;
}

escea_udp.prototype.controlfire = function(fire,state,cb)
{  
    var self = this;
    var message = new Buffer(16);
    var fs = 0x39;
    
    
    console.log("Control fire " + state);
    if (state == 0) {fs = 0x3A;}
    message[0] = 0x47; 
    message[1] = fs; //turn off
    for(var i = 2; i < 14;i++) { message[i] = 0x00; }
    message[14] = fs;
    message[15] = 0x46;
    this.controlfirecb = cb;
    this.processMessage(this.ipaddress,message,cb)
    
}    

