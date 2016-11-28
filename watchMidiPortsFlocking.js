var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./midiPortMonitor.js");

fluid.defaults("gpii.nexus.watchMidiPorts", {
    gradeNames: "fluid.modelComponent",
    components: {
        midiMonitor: {
            type: "gpii.nexus.midiPortMonitor"
        }
    },
    invokers: {
        startMonitoring: "{midiMonitor}.startMonitoring()"
    },
    modelListeners: {
        "{midiMonitor}.model.inputPorts": {
            listener: "gpii.nexus.watchMidiPorts.listInputPorts",
            args: ["{midiMonitor}.model.inputPorts"]
        }
    }
});

gpii.nexus.watchMidiPorts.listInputPorts = function (inputPorts) {
    console.log("Number of input ports: %d", inputPorts.length);
    for (var i = 0; i < inputPorts.length; i++) {
        console.log("%d: %s", i, inputPorts[i]);
    }
}

var watcher = gpii.nexus.watchMidiPorts();

watcher.startMonitoring();
