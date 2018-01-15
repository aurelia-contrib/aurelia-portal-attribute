import { PLATFORM } from 'aurelia-pal';

export { Portal } from './portal';

export function configure(frameworkConfig: any) {
  frameworkConfig.globalResources(PLATFORM.moduleName('./portal'));
}
