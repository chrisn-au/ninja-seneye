var stream = require('stream')
  , seneye_http = require('./seneye_http') 
  , util = require('util');

// Give our device a stream interface
util.inherits(seneye_ph,stream);

// Export it
module.exports=seneye_ph;
/*
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the Ninja Platform
 *
 * @fires data - Emit this when you wish to send data to the Ninja Platform
 */
function seneye_ph(em,device,name) {

  var self = this;
  
  
  this.em = em;
  this.device = device;
    // This device will emit data
  this.readable = true;
  
   
  this.G = "seneye"+this.device+"ph"; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
 // this.D = 9; // 2000 is a generic Ninja Blocks sandbox device
  this.D = 202; 
  this.name = name + " " + device + "Ave pH"
  
  this.em.on('phdata', function(temp){
          console.log("ph : " + temp.curr);   
          self.emit('data',temp.curr )    
          self.temp = temp; 
  });
         
  this._interval = setInterval(function() {
           self.emit('data',self.temp);     
   },60000);
   
};