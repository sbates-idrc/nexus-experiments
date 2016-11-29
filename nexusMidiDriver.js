var fluid = require("infusion"),
    flock = fluid.require("flocking"),
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
        start: "{midiMonitor}.startMonitoring()",
        getMidiInputPort: "{midiMonitor}.getInputPort"
    },
    modelListeners: {
        "{midiMonitor}.model.inputPortNames": {
            listener: "gpii.nexus.midiDriver.onMidiInputPortsChanged",
            args: ["{that}", "{change}.value", "{change}.oldValue"]
        }
    }
});

gpii.nexus.midiDriver.onMidiInputPortsChanged = function (that, inputPortNames, oldInputPortNames) {
    var diff = gpii.nexus.midiDriver.diffArrays(oldInputPortNames, inputPortNames);
    fluid.each(diff.added, function (portName) {
        // TODO: Better solution for this ALSA workaround
        if (portName && !portName.startsWith("Midi Through")) {
            console.log("Added MIDI port: %s", portName);
            // Open the newly added port
            //var port = that.getMidiInputPort(portName);
            var connection = flock.midi.connection({
                ports: {
                    input: {
                        name: portName
                    }
                },
                openImmediately: true,
                listeners: {
                    "noteOn.log": {
                        func: function () {
                            console.log("MIDI NOTE");
                        }
                    }
                }
            });
            //console.log(JSON.stringify(connection, null, 4));
            // TODO: Open MIDI port and register event listener
            // TODO: Construct a Nexus peer
            // TODO: Send changes to Nexus peer
        }
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
