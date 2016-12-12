var fluid = require("infusion"),
    flock = fluid.registerNamespace("flock"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("flocking-midi/packages/node_modules/flocking-midi-node");

fluid.defaults("gpii.nexus.midiDriver", {
    gradeNames: "fluid.modelComponent",

    components: {
        system: {
            type: "flock.midi.system",
            options: {
                pollForPortChanges: true
            }
        }
    },

    modelListeners: {
        "{system}.model.ports": {
            funcName: "gpii.nexus.midiDriver.onPortsChanged",
            args: ["{change}.value", "{change}.oldValue"]
        }
    }
});

gpii.nexus.midiDriver.onPortsChanged = function (portsModel, oldPortsModel) {
    console.log("PORTS CHANGED");
    var diff = gpii.nexus.midiDriver.diffPorts(portsModel, oldPortsModel);
    fluid.each(diff.added, function (port) {
        console.log("Added port: %s", port.id);
        flock.midi.connection({
            portName: port.name,
            listeners: {
                "noteOn.log": {
                    func: function (message) {
                        console.log("NOTE ON");
                        console.log(JSON.stringify(message, null, 4));
                    }
                },
                "noteOff.log": {
                    func: function (message) {
                        console.log("NOTE OFF");
                        console.log(JSON.stringify(message, null, 4));
                    }
                },
                "control.log": {
                    func: function (message) {
                        console.log("CONTROL");
                        console.log(JSON.stringify(message, null, 4));
                    }
                }
            }
        });
    });
    fluid.each(diff.removed, function (port) {
        console.log("Removed port: %s", port.id);
        // TODO: Clean up removed port
    });
};

gpii.nexus.midiDriver.diffPorts = function (portsModel, oldPortsModel) {
    // Note: super inefficient code (though fine for small number of ports)
    var diff = {
        added: [],
        removed: []
    };
    fluid.each(portsModel, function (port) {
        if (!gpii.nexus.midiDriver.containsPortWithId(oldPortsModel, port.id)) {
            diff.added.push({
                name: port.name,
                id: port.id
            });
        }
    });
    fluid.each(oldPortsModel, function (port) {
        if (!gpii.nexus.midiDriver.containsPortWithId(portsModel, port.id)) {
            diff.removed.push({
                name: port.name,
                id: port.id
            });
        }
    });
    return diff;
};

gpii.nexus.midiDriver.containsPortWithId = function (portsModel, portId) {
    return fluid.find_if(portsModel, function (port) {
        return port.id === portId;
    }) ? true : false;
};

gpii.nexus.midiDriver();
