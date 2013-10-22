var seneye_http = require('./lib/seneye_http')
  , seneye_driver = require ('./lib/seneye_driver')
  , seneye_ph = require('./lib/seneye_ph')
//  , escea_target = require('./lib/escea_target')
  , util = require('util')
  , stream = require('stream')
  , events = require('events'); 
  

// Give our driver a stream interface
util.inherits(seneye,stream);

// Our greeting to the user.


/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default driver configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the Ninja Platform
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the Ninja Platform
 */
 
var user = 'markaswift@gmail.com'
var password = '123456'
function seneye(opts,app) {

  var self = this;
  this.first = true;
  this._opts = opts;
  
  console.log("start");

  app.on('client::up',function(){

    // The client is now connected to the Ninja Platform

    // Check if we have sent an announcement before.
    // If not, send one and save the fact that we have.
    var seneye_comms = new seneye_http(user, password)
    
     queryDevices = function(devices) {
     
             devices.forEach(function (device) {
           
                 console.log("Device ID = " + device.id);
                 console.log("Name = " + device.description);
                 var eventemitter = new events.EventEmitter();
                 self.emit('register', new seneye_driver(seneye_comms,eventemitter, device.id,device.description));
                 self.emit('register', new seneye_ph(eventemitter,device.id,device.description));
  //        ]   self.emit('register', new escea_target(serial,eventemitter));
            });
      }
   
     if (self.first) {
               seneye_comms.listDevices(queryDevices);
               self.first = false;
     }          
  });
};

// Export it
module.exports = seneye;