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
            funcName: "gpii.nexus.midiPortMonitor.doMonitor",
            args: ["{that}", "{midi}"]
        }
    },
    listeners: {
        "{midi}.events.onPortsAvailable": {
            listener: "gpii.nexus.midiPortMonitor.updatePolledPorts",
            args: ["{that}", "{arguments}.0"] // ports
        }
    },
    modelListeners: {
        inputPorts: {
            listener: "gpii.nexus.midiPortMonitor.listInputPorts",
            args: ["{that}.model.inputPorts"]
        }
    }
});

gpii.nexus.midiPortMonitor.doMonitor = function (that, midi) {
    midi.refreshPorts();
    setTimeout(function () {
        gpii.nexus.midiPortMonitor.doMonitor(that, midi);
    }, that.model.pollMs);
};

gpii.nexus.midiPortMonitor.updatePolledPorts = function (that, polledPorts) {
    var polledInputPorts = [];
    fluid.each(polledPorts.inputs, function (port) {
        polledInputPorts[port.portNum] = port.name;
    });
    that.applier.change("inputPorts", polledInputPorts);
};

gpii.nexus.midiPortMonitor.listInputPorts = function (inputPorts) {
    console.log("Number of input ports: %d", inputPorts.length);
    for (var i = 0; i < inputPorts.length; i++) {
        console.log("%d: %s", i, inputPorts[i]);
    }
}

var monitor = gpii.nexus.midiPortMonitor();

monitor.startMonitoring();
