define(["require", "exports", "aurelia-pal", "./blur"], function (require, exports, aurelia_pal_1, blur_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Blur = blur_1.Blur;
    var defaultConfig = {
        mouse: true,
        touch: false,
        pointer: false,
        focus: true,
        windowBlur: true
    };
    function configure(frameworkConfig, blurConfig) {
        frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./blur'));
        blur_1.Blur.use(Object.assign({}, defaultConfig, blurConfig));
    }
    exports.configure = configure;
});
