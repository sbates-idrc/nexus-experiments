var fluid = require("infusion"),
    flock = fluid.require("flocking"),
    gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.nexus.midiPortMonitor", {
    gradeNames: "fluid.modelComponent",
    model: {
        pollMs: 1000,
        inputPorts: []
    },
    components: {
        midi: {
            type: "flock.midi.system"
        }
    },
    invokers: {
        "startMonitoring": {
            funcName: "gpii.nexus.midiPortMonitor.pollMidi",
            args: ["{midi}"]
        }
    },
    events: {
        midiPortPollDone: null,
    },
    listeners: {
        "{midi}.events.onPortsAvailable": {
            listener: "gpii.nexus.midiPortMonitor.updatePolledPorts",
            args: [
                "{that}",
                "{arguments}.0", // ports
                "{that}.events.midiPortPollDone"
            ]
        },
        "midiPortPollDone": {
            listener: "gpii.nexus.midiPortMonitor.schedulePoll",
            args: ["{that}"]
        }
    },
    modelListeners: {
        inputPorts: {
            listener: "gpii.nexus.midiPortMonitor.listInputPorts",
            args: ["{that}.model.inputPorts"]
        }
    }
});

gpii.nexus.midiPortMonitor.pollMidi = function (midi) {
    midi.refreshPorts();
};

gpii.nexus.midiPortMonitor.schedulePoll = function (that) {
    setTimeout(function () {
        gpii.nexus.midiPortMonitor.pollMidi(that.midi);
    }, that.model.pollMs);
};

gpii.nexus.midiPortMonitor.updatePolledPorts = function (that, polledPorts, doneEvent) {
    var polledInputPorts = [];
    fluid.each(polledPorts.inputs, function (port) {
        polledInputPorts[port.portNum] = port.name;
    });
    that.applier.change("inputPorts", polledInputPorts);
    doneEvent.fire();
};

gpii.nexus.midiPortMonitor.listInputPorts = function (inputPorts) {
    console.log("Number of input ports: %d", inputPorts.length);
    for (var i = 0; i < inputPorts.length; i++) {
        console.log("%d: %s", i, inputPorts[i]);
    }
}

var monitor = gpii.nexus.midiPortMonitor();

monitor.startMonitoring();
