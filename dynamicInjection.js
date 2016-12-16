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

// Recipe grade

fluid.defaults("gpii.nexus.experiments.recipeA", {
    gradeNames: "fluid.modelComponent",
    componentPaths: {
        componentA: null,
        componentB: null
    },
    components: {
        componentA: "@expand:fluid.componentForPath({recipeA}.options.componentPaths.componentA)",
        componentB: "@expand:fluid.componentForPath({recipeA}.options.componentPaths.componentB)"
    },
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

// Add some peers

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

fluid.construct("container.componentB3", {
    type: "gpii.nexus.experiments.gradeB",
    members: {
        name: "B3"
    }
});

// Make some recipe instances

fluid.construct("container.recipeA1", {
    type: "gpii.nexus.experiments.recipeA",
    componentPaths: {
        componentA: "container.componentA1",
        componentB: "container.componentB1"
    }
});

fluid.construct("container.recipeA2", {
    type: "gpii.nexus.experiments.recipeA",
    componentPaths: {
        componentA: "container.componentA2",
        componentB: "container.componentB2"
    }
});

fluid.construct("container.recipeA3", {
    type: "gpii.nexus.experiments.recipeA",
    componentPaths: {
        componentA: "container.componentA1",
        componentB: "container.componentB3"
    }
});

// Exercise the model relay rules

fluid.componentForPath("container.componentA1").applier.change("valueA", 100);
fluid.componentForPath("container.componentA2").applier.change("valueA", 200);
fluid.componentForPath("container.componentA1").applier.change("valueA", 110);
fluid.componentForPath("container.componentA2").applier.change("valueA", 220);
