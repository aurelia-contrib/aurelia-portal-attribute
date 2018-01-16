import { PLATFORM } from 'aurelia-pal';
export { Portal } from './portal';
export function configure(frameworkConfig) {
    frameworkConfig.globalResources(PLATFORM.moduleName('./portal'));
}
