var stream = require('stream')
  , escea_udp = require('./escea_udp') 
  , util = require('util');

// Give our device a stream interface
util.inherits(escea_room,stream);

// Export it
module.exports=escea_room;
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
function escea_room(serial,em) {

  var self = this;
  
  this.em = em;
  this.serial = serial;
    // This device will emit data
  this.readable = true;
  
   
  this.G = "esceafire"+this.serial; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
 // this.D = 9; // 2000 is a generic Ninja Blocks sandbox device
  this.D = 202; 
  
  
  this.em.on('Roomtemp', function(temp){
    
          self.emit('data',temp )    
          self.temp = temp; 
  });
         
  this._interval = setInterval(function() {
           self.emit('data',self.temp);     
   },60000);
   
};