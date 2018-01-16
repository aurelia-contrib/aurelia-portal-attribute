"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var portal_1 = require("./portal");
exports.Portal = portal_1.Portal;
function configure(frameworkConfig) {
    frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./portal'));
}
exports.configure = configure;
