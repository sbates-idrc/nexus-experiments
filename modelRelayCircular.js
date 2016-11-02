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
            model: {
                valueC: 10
            }
        });
    },
    function () {
        return gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.wiringComponent", {
            type: "fluid.modelComponent",
            modelRelay: [
                {
                    source: "{componentA}.model.valueA",
                    target: "{componentB}.model.valueB",
                    singleTransform: {
                        type: "fluid.transforms.linearScale",
                        factor: 1,
                        offset: 1
                    }
                },
                {
                    source: "{componentB}.model.valueB",
                    target: "{componentC}.model.valueC",
                    singleTransform: {
                        type: "fluid.transforms.linearScale",
                        factor: 1,
                        offset: 1
                    }
                },
                {
                    source: "{componentC}.model.valueC",
                    target: "{componentA}.model.valueA",
                    singleTransform: {
                        type: "fluid.transforms.linearScale",
                        factor: 1,
                        offset: 1
                    }
                }
            ]
        });        
    }
]);
