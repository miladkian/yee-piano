var midi = require('midi');
var yeeLight = require('./yee.js');
var Service, Characteristic, Accessory, UUIDGen;

// Set up a new input.
var input = new midi.input();

// Count the available input ports.
var test = input.getPortCount();
console.log("port count" + test);

// Get the name of a specified input port.
var test2 = input.getPortName(0);
console.log("port count" + test2);

// Configure a callback.


// Open the first available input port.
input.openPort(1);


// module.exports = function(homebridge) {
//     Accessory = homebridge.platformAccessory;
    
//     Service = homebridge.hap.Service;
//     Characteristic = homebridge.hap.Characteristic;
//     UUIDGen = homebridge.hap.uuid;
    
//     homebridge.registerPlatform("homebridge-yeelight", "yeelight", YeePlatform, true);    
// }



 
var handler = {

    onDevFound: function(dev) {
	var that = this;
	var uuid;
	var found = 0;
	var newAccessory = null;
	var lightbulbService = null;
        var name;
	
	for (var index in this.yeeAccessories) {
	    var accessory = this.yeeAccessories[index];
	    if (accessory.context.did == dev.did) {
		newAccessory = accessory;
		found = 1;
		break;
	    }
	}

	if (found) {
	    console.log("cached accessory: " + newAccessory.context.did);
	    lightbulbService = newAccessory.getService(Service.Lightbulb);
	} else {
	    //uuid = UUIDGen.generate(dev.did);
	    uuid = Math.random().toString(36).substring(7);
            name = dev.did.name || dev.did.substring(dev.did.length-6);
            console.log("found dev: " + name); 
	  //  newAccessory = new Accessory(name, uuid);
	   // newAccessory.context.did = dev.did;
	   // newAccessory.context.model = dev.model;
	   // lightbulbService = new Service.Lightbulb(name);	    
	}

	
	dev.ctx = newAccessory;
	 console.log(dev.power);

	  console.log(dev.bright);
	   console.log(dev.hue);
	    console.log(dev.sat);
	     console.log(dev.model);



	// lightbulbService
	//     .getCharacteristic(Characteristic.On)
	//     .on('set', function(value, callback) { that.exeCmd(dev.did, "power", value, callback);})
	//     .value = dev.power;

	// if (!found) {
	//     lightbulbService
	// 	.addCharacteristic(Characteristic.Brightness)
	// 	.on('set', function(value, callback) { that.exeCmd(dev.did, "brightness", value, callback);})
	// 	.value = dev.bright;

	//     if (dev.model == "color" || dev.model == "stripe" || dev.model == "bedside") {
	// 	lightbulbService
	// 	    .addCharacteristic(Characteristic.Hue)
	// 	    .on('set', function(value, callback) { that.exeCmd(dev.did, "hue", value, callback);})
	//             .value = dev.hue;

	// 	lightbulbService
	// 	    .addCharacteristic(Characteristic.Saturation)
	// 	    .on('set', function(value, callback) { that.exeCmd(dev.did, "saturation", value, callback);})
	//             .value = dev.sat;
	//     }
	// } else {
	//     lightbulbService
	// 	.getCharacteristic(Characteristic.Brightness)
	// 	.on('set', function(value, callback) { that.exeCmd(dev.did, "brightness", value, callback);})
	// 	.value = dev.bright;

	//     if (dev.model == "color" || dev.model == "stripe" || dev.model == "bedside") {
	// 	lightbulbService
	// 	    .getCharacteristic(Characteristic.Hue)
	// 	    .on('set', function(value, callback) { that.exeCmd(dev.did, "hue", value, callback);})
	//             .value = dev.hue;
		

	// 	lightbulbService
	// 	    .getCharacteristic(Characteristic.Saturation)
	// 	    .on('set', function(value, callback) { that.exeCmd(dev.did, "saturation", value, callback);})
	//             .value = dev.sat;
	//     }	    
	// }


 //    if (dev.model.search(/color.*/g) !== -1 || dev.model.search(/strip.*/g) !== -1) {
 //    } else {
 //        if (dev.model !== 'mono' && dev.model !== 'ceiling2') {
 //            lightbulbService.addOptionalCharacteristic(Characteristic.ColorTemperature);
 //            lightbulbService.getCharacteristic(Characteristic.ColorTemperature)
 //                .on('set', function(value, callback) { that.exeCmd(dev.did, "ct", value, callback)})
 //                .on('get', function(callback){callback(null, dev.ct);})
 //                .updateValue(dev.ct);
 //        }
 //    }

	// newAccessory.reachable = true;

	// if (!found) {
	//     newAccessory.addService(lightbulbService, name);
	//     this.yeeAccessories.push(newAccessory);
	//     this.api.registerPlatformAccessories("homebridge-yeelight", "yeelight", [newAccessory]);
	// }
    },

    onDevConnected: function(dev) {
	console.log("accesseory reachable");

	console.log("dev connected " + dev.did + " " + dev.connected);	
	console.log('------------------------------------')
	console.log('------------------------------------')
	console.log(dev)
	console.log('------------------------------------')
	console.log('------------------------------------')

	dev.setBright(120);
	dev.setColor(120,200);

	input.on('message', function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  if(message != '254'){
  	if(message[2] != 0)
 console.log('m:' + message[2] );

dev.setColor(Math.floor(Math.random() * (200 - 50 + 1)) + 50,200);
 }
  
 
});
	//var accessory = dev.ctx;
	//accessory.updateReachability(true);	
    },

    onDevDisconnected: function(dev) {
	console.log("accesseory unreachable");

	console.log("dev disconnected " + dev.did + " " + dev.connected);	
	var accessory = dev.ctx;

	// updateReachability seems have bug, but remove the accessory will cause
	// the name of the light gone, leave the user to decide...
	if (1) {
	    accessory.updateReachability(false);	    
	} else {
	    this.api.unregisterPlatformAccessories("homebridge-yeelight", "yeelight", [accessory]);

	    var idx = this.yeeAccessories.indexOf(accessory);
	    if (idx > -1) {
		this.yeeAccessories.splice(idx, 1);
	    }

	    this.yeeAgent.delDevice(dev.did);
	}
    },

    onDevPropChange: function(dev, prop, val) {
        var accessory = dev.ctx;
        var character;
        var lightbulbService = accessory.getService(Service.Lightbulb);

       console.log("update accessory prop: " + prop + "value: " + val);

        if (prop == "power") {
            character = lightbulbService.getCharacteristic(Characteristic.On)
        } else if (prop == "bright") {
            character = lightbulbService.getCharacteristic(Characteristic.Brightness)
        } else if (prop == "sat") {
            character = lightbulbService.getCharacteristic(Characteristic.Saturation)
        } else if (prop == "hue") {
            character = lightbulbService.getCharacteristic(Characteristic.Hue)
        } else if (prop == "ct") {
            character = lightbulbService.getCharacteristic(Characteristic.ColorTemperature)
        } else {
            return;
        }
        character.updateValue(val);
    },

    configureAccessory: function(accessory) {
	var platform = this;

	//accessory.updateReachability(false);
	accessory.reachable = true;

	accessory.on('identify', function(paired, callback) {
            platform.log("identify ....");
	});

	this.yeeAccessories.push(accessory);
	
	return;
    },

    exeCmd: function(did, characteristic, value, callback) {

        dev = this.yeeAgent.getDevice(did);

        if (dev == null) {
         console.log("no device found for did: " + did);
            return;
        }

	switch(characteristic.toLowerCase()) {
	    
	case 'identify':
           console.log("identfy....");
	    dev.setBlink();
	    break;
	case 'power':
	    dev.setPower(value);
	    break;
	case 'hue':
	    dev.setColor(value, dev.sat);
	    break;
	case 'brightness':
	    dev.setBright(value);
	    break;
	case 'saturation':
	    dev.setColor(dev.hue, value);
	    break;
    case 'ct':
        dev.setCT(value);
        break;
	default:
	    break;
	}

	if (callback)
	    callback();
    },
    
    /*
    configurationRequestHandler : function(context, request, callback) {
	this.log("Context: ", JSON.stringify(context));
	this.log("Request: ", JSON.stringify(request));
	// Check the request response
	if (request && request.response && request.response.inputs && request.response.inputs.name) {
	    this.addAccessory(request.response.inputs.name);
	    return;
	}
	var respDict = {
	    "type": "Interface",
	    "interface": "input",
	    "title": "Add Accessory",
	    "items": [
		{
		    "id": "name",
		    "title": "Name",
		    "placeholder": "Fancy Light"
		},
	    ]
	}
	context.ts = "Hello";
	//invoke callback to update setup UI
	callback(respDict);
    }
    */
};

YeePlatform();

function YeePlatform() {
    
    
    var platform = handler;
     this.yeeAccessories = [];
    // this.log = console;
    this.config = null;
    
   

	
	    
            platform.yeeAgent = new yeeLight.YeeAgent("0.0.0.0", platform);
            platform.yeeAgent.startDisc();
	    
	
}


// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(true, true, true);

// ... receive MIDI messages ...

// Close the port when done.
//input.closePort();