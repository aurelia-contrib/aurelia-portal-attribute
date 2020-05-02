import { Aurelia, Controller, TaskQueue, ObserverLocator, inlineView } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import { configure as configurePortal } from '../src';

interface Constructable<T> {
  new (...args: any[]): T;
}

let $taskQueue: TaskQueue | undefined;

export async function bootstrapComponent<T>(ViewModel: T | Constructable<T>, View: string = '', extraResources: any[] = []) {
  const aurelia = new Aurelia();
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .eventAggregator()
    .plugin(configurePortal)
    .globalResources(extraResources);

  const host = document.createElement('div');
  const klass = typeof ViewModel === 'function'
    ? ViewModel
    : class BoundViewModel {
      constructor () {
        return ViewModel
      }
    };

  if (View) {
    inlineView(View)(klass);
  }

  if (!$taskQueue) {
    $taskQueue = aurelia.container.get(TaskQueue);
  } else {
    aurelia.container.registerInstance(TaskQueue, $taskQueue);
  }

  await aurelia.start();
  await aurelia.setRoot(klass, host);

  const root = aurelia['root'] as Controller;
  return {
    host,
    viewModel: root.viewModel as T,
    taskQueue: $taskQueue,
    observerLocator: aurelia.container.get(ObserverLocator),
    dispose: () => {
      $taskQueue.flushMicroTaskQueue();
      root.detached();
      root.unbind();

      $taskQueue.flushMicroTaskQueue();
    }
  };
}

export function markupToElement(markup: string) {
  return (DOM.createTemplateFromMarkup(`<template>${markup}</template>`) as HTMLTemplateElement).content.firstChild as HTMLElement;
}
