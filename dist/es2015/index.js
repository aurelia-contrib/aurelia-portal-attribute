import { PLATFORM } from 'aurelia-pal';
import { Blur } from './blur';
var defaultConfig = {
    mouse: true,
    touch: false,
    pointer: false,
    focus: true,
    windowBlur: true
};
export function configure(frameworkConfig, blurConfig) {
    frameworkConfig.globalResources(PLATFORM.moduleName('./blur'));
    Blur.use(Object.assign({}, defaultConfig, blurConfig));
}
export { Blur };
