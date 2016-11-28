var fluid = require("infusion"),
    flock = fluid.require("flocking"),
    gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.nexus.midiPortMonitor", {
    gradeNames: "fluid.modelComponent",
    model: {
        pollMs: 1000,
        inputPortNames: []
    },
    components: {
        midi: {
            type: "flock.midi.system"
        }
    },
    invokers: {
        startMonitoring: {
            funcName: "gpii.nexus.midiPortMonitor.pollMidi",
            args: ["{midi}"]
        },
        getInputPort: {
            funcName: "gpii.nexus.midiPortMonitor.getInputPort",
            args: ["{midi}", "{arguments}.0"] // port name
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
    var polledInputPortNames = [];
    fluid.each(polledPorts.inputs, function (port) {
        polledInputPortNames.push(port.name);
    });
    that.applier.change("inputPortNames", polledInputPortNames);
    doneEvent.fire();
};

gpii.nexus.midiPortMonitor.getInputPort = function (midi, portName) {
    return fluid.find(midi.ports.inputs, function (port) {
        return (port.name === portName ? port : undefined);
    });
};
