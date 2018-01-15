System.register(["aurelia-pal", "./blur"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(frameworkConfig, blurConfig) {
        frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./blur'));
        blur_1.Blur.use(Object.assign({}, defaultConfig, blurConfig));
    }
    exports_1("configure", configure);
    var aurelia_pal_1, blur_1, defaultConfig;
    return {
        setters: [
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            },
            function (blur_1_1) {
                blur_1 = blur_1_1;
            }
        ],
        execute: function () {
            exports_1("Blur", blur_1.Blur);
            defaultConfig = {
                mouse: true,
                touch: false,
                pointer: false,
                focus: true,
                windowBlur: true
            };
        }
    };
});
