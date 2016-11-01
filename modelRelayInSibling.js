"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");

var nexusHost = "localhost";
var nexusPort = 9081;

fluid.promise.sequence([
    function () {
        return gpii.constructNexusPeer(nexusHost, nexusPort, "nexus", {
            type: "fluid.modelComponent",
        });
    },
    function () {
        return gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.componentA", {
            type: "fluid.modelComponent",
            model: {
                valueA: 10
            }
        });
    },
    function () {
        return gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.componentB", {
            type: "fluid.modelComponent",
            model: {
                valueB: 10
            }
        });
    },
    function () {
        return gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.componentC", {
            type: "fluid.modelComponent",
            modelRelay: [
                {
                    source: "{componentA}.model.valueA",
                    target: "{componentB}.model.valueB",
                    singleTransform: {
                        type: "fluid.transforms.identity"
                    }
                }
            ]
        });        
    }
]);
