"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

// Peer grades

fluid.defaults("gpii.nexus.experiments.gradeA", {
    gradeNames: "fluid.modelComponent",
    model: {
        valueA: 10
    }
});

fluid.defaults("gpii.nexus.experiments.gradeB", {
    gradeNames: "fluid.modelComponent",
    model: {
        valueB: 20
    },
    modelListeners: {
        valueB: {
            listener: console.log,
            args:["%s valueB: %s", "{that}.name", "{arguments}.0"]
        }
    }
});

// Recipe wiring grade

fluid.defaults("gpii.nexus.experiments.recipeA.wiring", {
    gradeNames: "fluid.modelComponent",
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

// Root component

fluid.construct("container", {
    type: "fluid.modelComponent"
});

// Add 2 of each peer grade

fluid.construct("container.componentA1", {
    type: "gpii.nexus.experiments.gradeA"
});

fluid.construct("container.componentA2", {
    type: "gpii.nexus.experiments.gradeA"
});

fluid.construct("container.componentB1", {
    type: "gpii.nexus.experiments.gradeB",
    members: {
        name: "B1"
    }
});

fluid.construct("container.componentB2", {
    type: "gpii.nexus.experiments.gradeB",
    members: {
        name: "B2"
    }
});

// Instance 1 of the recipe

fluid.construct("container.recipeA1", {
    type: "fluid.modelComponent"
});

fluid.globalInstantiator.recordKnownComponent(
    fluid.componentForPath("container.recipeA1"),
    fluid.componentForPath("container.componentA1"),
    "componentA",
    false);

fluid.globalInstantiator.recordKnownComponent(
    fluid.componentForPath("container.recipeA1"),
    fluid.componentForPath("container.componentB1"),
    "componentB",
    false);

fluid.construct("container.recipeA1.wiring", {
    type: "gpii.nexus.experiments.recipeA.wiring"
});

// Instance 2 of the recipe

fluid.construct("container.recipeA2", {
    type: "fluid.modelComponent"
});

fluid.globalInstantiator.recordKnownComponent(
    fluid.componentForPath("container.recipeA2"),
    fluid.componentForPath("container.componentA2"),
    "componentA",
    false);

fluid.globalInstantiator.recordKnownComponent(
    fluid.componentForPath("container.recipeA2"),
    fluid.componentForPath("container.componentB2"),
    "componentB",
    false);

fluid.construct("container.recipeA2.wiring", {
    type: "gpii.nexus.experiments.recipeA.wiring"
});

// Exercise the model relay rules

fluid.componentForPath("container.componentA1").applier.change("valueA", 100);
fluid.componentForPath("container.componentA2").applier.change("valueA", 200);
fluid.componentForPath("container.componentA1").applier.change("valueA", 110);
fluid.componentForPath("container.componentA2").applier.change("valueA", 220);

// TODO: Test a component used in multiple recipes
