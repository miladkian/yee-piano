var midi = require('midi');

// Set up a new input.
var input = new midi.input();

// Count the available input ports.
var test = input.getPortCount();
console.log("port count" + test);

// Get the name of a specified input port.
var test2 = input.getPortName(0);
console.log("port count" + test2);

// Configure a callback.
input.on('message', function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  if(message != '254'){
  	if(message[2] != 0)
 console.log('m:' + message[2] );
 }
  
 
});

// Open the first available input port.
input.openPort(1);

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