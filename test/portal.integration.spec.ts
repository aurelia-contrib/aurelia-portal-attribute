import './setup';
import { bootstrapComponent } from "./utils";

describe('portal.integration.spec.ts', () => {
  it('portals to head correctly', async () => {

    const { viewModel, host, taskQueue, dispose } = await bootstrapComponent(
      class {
        message = 'Hello from Aurelia';
        titleEl: any = null;
      },
      `<template>
        <title portal="target: head; position: afterbegin" ref=titleEl>\${message}</title>
      </template>`
    );

    expect(host.querySelector('title')).toBe(null);
    expect(viewModel.titleEl).not.toBe(null);
    expect(document.querySelector('title')).toBe(viewModel.titleEl);
    expect(document.title).toBe('Hello from Aurelia');
    viewModel.message = 'Hello from Au';
    taskQueue.flushMicroTaskQueue();
    expect(document.title).toBe('Hello from Au');

    dispose();

    expect(document.title).not.toBe('Hello from Au');
  });

  it('portals multiple root elements correctly', async () => {
    const { viewModel, host, taskQueue, dispose } = await bootstrapComponent(
      class {
        message = 'Hello from Aurelia';
        charset = 'utf-8';
      },
      `<template>
        <template portal="target: head; position: afterbegin">
          <title >\${message}</title>
          <meta charset.bind="charset & attr"></meta>
        </template>
      </template>`
    );

    expect(host.childElementCount).toBe(0);
    expect(document.head.querySelector('meta').getAttribute('charset')).toBe('utf-8');
    viewModel.charset = 'utf-88';
    taskQueue.flushMicroTaskQueue();
    expect(document.head.querySelector('meta').getAttribute('charset')).toBe('utf-88');

    dispose();
    expect(document.head.querySelector('meta').getAttribute('charset')).not.toBe('utf-88');
  });
});
