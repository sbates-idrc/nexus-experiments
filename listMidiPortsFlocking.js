var fluid = require("infusion"),
    flock = fluid.require("flocking");

var midi = flock.midi.system();

console.log(JSON.stringify(midi.ports, null, 4));

// See https://github.com/justinlatimer/node-midi/issues/117
process.exit();
