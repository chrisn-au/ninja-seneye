var stream = require('stream')
  , escea_udp = require('./seneye_http') 
  , util = require('util');

// Give our device a stream interface
util.inherits(seneye_driver,stream);

// Export it
module.exports=seneye_driver;
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
function seneye_driver(seneye_comms,em, driver, name) {

  var self = this;
  this.comms = seneye_comms;
  this.em = em;
  this.driver = driver;
  this.temperture = 0; 
  this.em = em;
  this.name = name + " " + driver + "Ave Temp"
  
   console.log("Driver # is " + driver);
 
  // This device will emit data
  this.readable = true;
  this.writeable = false; //switch will receive data
   
  this.G = "seneye"+this.driver; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  // 238 Relay switch
  this.D = 202; 
  
  
  devicestatus = function(tankdata) {
             console.log("Temp " + tankdata.temperature.curr);
             self.temperature = tankdata.temperature.curr;
             self.em.emit("phdata", tankdata.ph);
//             self.em.emit("Targettemp", targettemp);
             self.emit('data',self.temperature ) 
             
      }

  self.comms.queryDevice(self.driver,devicestatus);
         
  this._interval = setInterval(function() {
        self.comms.queryDevice(self.driver,devicestatus);
        self.emit('data',self.state);     
   },60000);
   
};


     
