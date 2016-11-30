// This file is an attempt to reproduce a seg fault that I was seeing on ALSA.
// I have been unable to reproduce the issue and this program does not seg
// fault.

var midi = require("midi");

listPorts = function (midiInput) {
    var numInputPorts = midiInput.getPortCount();
    for (var i = 0; i < numInputPorts; i++) {
        console.log("%d: %s", i, midiInput.getPortName(i));
    }
};

logEvents = function (midiInput, portName) {
    var numInputPorts = midiInput.getPortCount();
    for (var i = 0; i < numInputPorts; i++) {
        if (midiInput.getPortName(i).startsWith(portName)) {
            midiInput.on("message", function (deltaTime, message) {
                console.log(message);
            });
            midiInput.openPort(i);
            break;
        }
    }
};

var input1 = new midi.input();
var input2 = new midi.input();

listPorts(input1);
logEvents(input2, "Virtual Keyboard");

setTimeout(function () {
    listPorts(input1);
    var inputs = [];
    for (var i = 0; i < 10; i++) {
        inputs.push(new midi.input());
    }
    while (inputs.length > 0) {
        console.log("release()");
        inputs.shift().release();
    }
}, 5000);
