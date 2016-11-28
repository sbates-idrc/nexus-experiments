var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./midiPortMonitor.js");

// TODO: Rework the port monitoring and port opening code when move to flocking-midi

fluid.defaults("gpii.nexus.midiDriver", {
    gradeNames: "fluid.modelComponent",
    components: {
        midiMonitor: {
            type: "gpii.nexus.midiPortMonitor"
        }
    },
    invokers: {
        start: "{midiMonitor}.startMonitoring()"
    },
    modelListeners: {
        "{midiMonitor}.model.inputPortNames": {
            listener: "gpii.nexus.midiDriver.logChange",
            args: ["{change}.value", "{change}.oldValue"]
        }
    }
});

gpii.nexus.midiDriver.logChange = function (inputPortNames, oldInputPortNames) {
    var diff = gpii.nexus.midiDriver.diffArrays(oldInputPortNames, inputPortNames);
    fluid.each(diff.added, function (portName) {
        console.log("Added MIDI port: %s", portName);
    });
    fluid.each(diff.removed, function (portName) {
        console.log("Removed MIDI port: %s", portName);
    });
};

gpii.nexus.midiDriver.diffArrays = function (before, after) {
    // Note: super inefficient code (though fine for very short arrays)
    var diff = {
        added: [],
        removed: []
    };
    fluid.each(after, function (item) {
        if (!fluid.contains(before, item)) {
            diff.added.push(item);
        }
    });
    fluid.each(before, function (item) {
        if (!fluid.contains(after, item)) {
            diff.removed.push(item);
        }
    });
    return diff;
};

var midiDriver = gpii.nexus.midiDriver();

midiDriver.start();
