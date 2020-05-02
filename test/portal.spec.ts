import './setup';
import { OverrideContext, createOverrideContext } from 'aurelia-binding';
import { Container } from 'aurelia-dependency-injection';
import { PLATFORM, DOM } from 'aurelia-pal';
import {
  ViewFactory,
  ViewSlot,
  BoundViewFactory,
  ViewResources,
  View
} from 'aurelia-templating';

import { markupToElement } from './utils';
import { Portal } from '../src/portal';

describe('Portal attribute', () => {

  let viewFactory: ViewFactory;
  let boundViewFactory: BoundViewFactory;
  let originalViewSlot: ViewSlot;
  let container: Container;

  let host: HTMLDivElement;
  let viewSlotAnchor: Comment;

  let bindingContext: any
  let overrideContext: OverrideContext;
  let portal: Portal;
  let view: View;

  beforeEach(() => {

    container = new Container().makeGlobal();
    document.body.innerHTML = '';
    document.body.appendChild(
      host = h('div', null,
        h('div', { class: 'square1' }),
        h('div', { class: 'square2' }),
        h('div', { class: 'square3' }),
        h('div', { class: 'round' },
          h('div', { id: 'square1', class: 'square1' })
        ),
        h('div', { id: 'portal-container-element' },
          viewSlotAnchor = document.createComment('anchor')
        )
      )
    );

    const portalTemplate = DOM.createTemplateFromMarkup(
      `<template>
        <form>
          <input />
          <button>Click me</button>
        </form>
      </template>`
    ) as HTMLTemplateElement;

    viewFactory = new ViewFactory(portalTemplate.content, {}, container.get(ViewResources));
    boundViewFactory = new BoundViewFactory(container, viewFactory);
    originalViewSlot = new ViewSlot(viewSlotAnchor, false);

    container.registerInstance(BoundViewFactory, boundViewFactory);
    container.registerInstance(ViewSlot, originalViewSlot);

    viewFactory.create = function() {
      view = ViewFactory.prototype.create.apply(this, arguments);
      return view;
    }

    bindingContext = {
      appName: 'App'
    };
    overrideContext = createOverrideContext(bindingContext);
    portal = container.get(Portal);
  });

  it('binds', () => {
    portal.bind(bindingContext, overrideContext);

    expect(view.bindingContext).toBe(bindingContext);
    expect(view.overrideContext).toBe(overrideContext);
  });

  it('caches view', () => {
    portal.bind(bindingContext, overrideContext);

    let _view1 = (portal as any).view;

    portal.bind(bindingContext, overrideContext);
    let _view2 = (portal as any).view;

    expect(_view1).toBe(_view2);
  });

  it('binds and inits render', () => {
    portal.initialRender = true;
    spyOn(originalViewSlot, 'add').and.callThrough();
    spyOn(originalViewSlot, 'remove').and.callThrough();

    portal.bind(bindingContext, overrideContext);

    expect(originalViewSlot.add).toHaveBeenCalledWith(view);
    expect(originalViewSlot.remove).toHaveBeenCalledWith(view);
  });

  describe('rendering', () => {

    it('renders to body when target is not specified', async (done) => {
      portal.bind(bindingContext, overrideContext);

      await portal.attached();

      expect(document.body.lastElementChild.tagName).toBe('FORM');
      done();
    });

    it('renders to specified target via CSS selector', async (done) => {
      portal.target = '.square3';
      portal.bind(bindingContext, overrideContext);

      await portal.attached();

      expect(document.querySelector('.square3 form')).not.toBeFalsy();
      done();
    });

    it('renders with renderContext', async (done) => {
      portal.target = '.square1';
      portal.renderContext = '.round';

      portal.bind(bindingContext, overrideContext);
      await portal.attached();

      expect(document.querySelector('.round form')).not.toBeFalsy();
      done();
    });

    it('renders to first square with renderContext selector query with no result', async (done) => {
      portal.target = '.square1';
      portal.renderContext = '.super-round';

      portal.bind(bindingContext, overrideContext);
      await portal.attached();

      expect(document.querySelector('.round form')).toBe(null);
      expect(document.querySelector('.square1 form')).not.toBeFalsy();
      done();
    });

    it('does not re-render when target has not been changed', async (done) => {
      let callCount = 0;
      portal.activating = function() {
        callCount++;
      }
      portal.bind(bindingContext, overrideContext);
      await portal.attached();

      expect(callCount).toBe(1);
      await portal.targetChanged();
      await portal.targetChanged();

      expect(callCount).toBe(1);

      done();
    });

    it('re-renders after target has changed', async (done) => {
      portal.target = '.square2';
      portal.bind(bindingContext, overrideContext);

      await portal.attached();
      expect(document.querySelector('.square2 form')).not.toBeFalsy();

      portal.target = '.square3';
      await portal.targetChanged();
      expect(document.querySelector('.square2 form')).toBeFalsy();
      expect(document.querySelector('.square3 form')).not.toBeFalsy();

      done();
    });

    it('does not render when not attached', async (done) => {
      portal.bind(bindingContext, overrideContext);

      await portal.targetChanged();

      expect(document.querySelector('form')).toBe(null);
      expect((portal as any).viewSlot).toBe(undefined);

      await portal.attached();
      expect(document.querySelector('form')).not.toBeFalsy();

      portal.detached();

      done();
    });

    it('throws in strict mode', () => {
      portal.strict = true;
      portal.target = '.square4';
      portal.bind(bindingContext, overrideContext);

      expect(() => portal.attached()).toThrow();
    });

    it('call detached()', async (done) => {
      portal.bind(bindingContext, overrideContext);
      await portal.attached();

      spyOn(view, 'detached').and.callThrough();
      portal.detached();
      expect(view.detached).toHaveBeenCalled();

      done();
    });
  });

  describe('life-cycle', () => {

    it('calls life cycle', async (done) => {
      let activateCalled = false;
      let activatedCalled = false;

      let deactivateCalled = false;
      let deactivatingResolvedTime: number;

      let deactivatedCalled = false;
      let deactivatedResolvedTime: number;

      portal.activating = function() {
        activateCalled = true;
      }
      portal.activated = function() {
        activatedCalled = true;
      }
      portal.deactivating = function() {
        return new Promise((resolve) => {
          setTimeout(() => {
            deactivateCalled = true;
            deactivatingResolvedTime = +new Date();
            resolve();
          }, 1000);
        });
      }
      portal.deactivated = function() {
        deactivatedCalled = true;
        deactivatedResolvedTime = +new Date();
      }

      portal.bind(bindingContext, overrideContext);
      await portal.attached();

      expect(activateCalled).toBe(true);
      expect(activatedCalled).toBe(true);

      portal.target = '.square3';

      expect((portal as any).viewSlot).toBeTruthy();
      await portal.targetChanged();

      expect(deactivateCalled).toBe(true);
      expect(deactivatedCalled).toBe(true);

      // deactivated will be called immediately after resolving deactivate
      // In this test it should be less than 10
      expect(Math.abs(deactivatedResolvedTime - deactivatingResolvedTime)).toBeLessThan(10);

      done();
    });

  });

  it('un-renders', async (done) => {
    portal.bind(bindingContext, overrideContext);
    await portal.attached();

    expect(document.querySelector('form')).not.toBeFalsy();

    portal.detached();
    portal.unbind();
    expect(document.querySelector('form')).toBeFalsy();

    done();
  });
});

function h<T extends keyof HTMLElementTagNameMap>(name: T, attrs: Record<string, string | number> = {}, ...children: (string | HTMLElement | Comment | Text) []) {
  let el = document.createElement<T>(name);
  for (let attr in attrs) {
    el.setAttribute(attr, '' + attrs[attr]);
  }
  for (let child of children) {
    el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}
