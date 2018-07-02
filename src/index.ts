import { Portal } from './portal';
export { Portal, PortalLifecycleCallback } from './portal';

export function configure(frameworkConfig: any) {
  frameworkConfig.globalResources(Portal);
}
