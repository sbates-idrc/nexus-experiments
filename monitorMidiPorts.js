var fluid = require("infusion");
var midi = require("midi");

var pollMs = 1000;

function getMidiInputPorts(midiInput) {
    var ports = [];
    var numPorts = midiInput.getPortCount();
    for (var i = 0; i < numPorts; i++) {
        ports[i] = midiInput.getPortName(i);
    }
    return ports;
}

function listMidiInputPorts(midiInputPorts) {
    console.log("Number of input ports: %d", midiInputPorts.length);
    for (var i = 0; i < midiInputPorts.length; i++) {
        console.log("%d: %s", i, midiInputPorts[i]);
    }
}

var midiInput = new midi.input();
var midiInputPorts = [];

function monitorMidiInputPorts() {
    var polledMidiInputPorts = getMidiInputPorts(midiInput);
    if (!fluid.model.diff(midiInputPorts, polledMidiInputPorts)) {
        midiInputPorts = polledMidiInputPorts;
        listMidiInputPorts(midiInputPorts);
        console.log("");
    }
    setTimeout(monitorMidiInputPorts, pollMs);
}

monitorMidiInputPorts();
