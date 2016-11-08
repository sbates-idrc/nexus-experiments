var midi = require("midi");
var input = new midi.input();

var numInputPorts = input.getPortCount();

console.log("Number of input ports: %d", numInputPorts);

var i;
for (i = 0; i < numInputPorts; i++) {
    console.log("%d: %s", i, input.getPortName(i));
}

// See https://github.com/justinlatimer/node-midi/issues/117
process.exit();
