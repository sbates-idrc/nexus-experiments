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
        "{midiMonitor}.model.inputPortNames": {
            listener: "gpii.nexus.watchMidiPorts.listInputPorts",
            args: ["{midiMonitor}.model.inputPortNames"]
        }
    }
});

gpii.nexus.watchMidiPorts.listInputPorts = function (inputPortNames) {
    console.log("Number of input ports: %d", inputPortNames.length);
    fluid.each(inputPortNames, function (portName) {
        console.log(portName);
    });
}

var watcher = gpii.nexus.watchMidiPorts();

watcher.startMonitoring();
