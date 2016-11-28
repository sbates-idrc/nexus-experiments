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
