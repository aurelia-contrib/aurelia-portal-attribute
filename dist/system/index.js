System.register(["aurelia-pal", "./portal"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(frameworkConfig) {
        frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./portal'));
    }
    exports_1("configure", configure);
    var aurelia_pal_1;
    return {
        setters: [
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            },
            function (portal_1_1) {
                exports_1({
                    "Portal": portal_1_1["Portal"]
                });
            }
        ],
        execute: function () {
        }
    };
});
