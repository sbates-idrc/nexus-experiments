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

// Recipe relay grade

fluid.defaults("gpii.nexus.experiments.recipeA.relay", {
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

gpii.nexus.experiments.constructRecipe = function (path, relayOptions, components, instantiator) {
    instantiator = instantiator || fluid.globalInstantiator;

    fluid.construct(path, {
        type: "fluid.modelComponent"
    }, instantiator);

    fluid.each(components, function (componentPath, componentName) {
        instantiator.recordKnownComponent(
            fluid.componentForPath(path),
            fluid.componentForPath(componentPath),
            componentName,
            false);
    });

    fluid.construct(path + ".relay", relayOptions, instantiator);
};

gpii.nexus.experiments.constructRecipe(
    "container.recipeA1",
    {
        type: "gpii.nexus.experiments.recipeA.relay"
    },
    {
        componentA: "container.componentA1",
        componentB: "container.componentB1"
    }
);

gpii.nexus.experiments.constructRecipe(
    "container.recipeA2",
    {
        type: "gpii.nexus.experiments.recipeA.relay"
    },
    {
        componentA: "container.componentA2",
        componentB: "container.componentB2"
    }
);

gpii.nexus.experiments.constructRecipe(
    "container.recipeA3",
    {
        type: "gpii.nexus.experiments.recipeA.relay"
    },
    {
        componentA: "container.componentA1",
        componentB: "container.componentB3"
    }
);

// Exercise the model relay rules

fluid.componentForPath("container.componentA1").applier.change("valueA", 100);
fluid.componentForPath("container.componentA2").applier.change("valueA", 200);
fluid.componentForPath("container.componentA1").applier.change("valueA", 110);
fluid.componentForPath("container.componentA2").applier.change("valueA", 220);
