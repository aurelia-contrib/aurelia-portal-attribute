define(["require", "exports", "aurelia-pal", "./portal"], function (require, exports, aurelia_pal_1, portal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Portal = portal_1.Portal;
    function configure(frameworkConfig) {
        frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./portal'));
    }
    exports.configure = configure;
});
