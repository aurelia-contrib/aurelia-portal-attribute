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

import { markupToElement } from './util';
import { Portal } from '../../src/portal';

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

  it('bind and init render', () => {
    portal.initialRender = true;
    spyOn(originalViewSlot, 'add').and.callThrough();
    spyOn(originalViewSlot, 'remove').and.callThrough();

    portal.bind(bindingContext, overrideContext);

    expect(originalViewSlot.add).toHaveBeenCalledWith(view);
    expect(originalViewSlot.remove).toHaveBeenCalledWith(view);
  });

  describe('rendering', () => {

    it('renders to body when target is not specified', () => {
      portal.bind(bindingContext, overrideContext);

      portal.attached();

      expect(document.body.lastElementChild.tagName).toBe('FORM');
    });

    it('renders to specified target via CSS selector', () => {
      portal.target = '.square3';
      portal.bind(bindingContext, overrideContext);

      portal.attached();

      expect(document.querySelector('.square3 form')).not.toBeFalsy();
    });

    it('re-renders after target has changed', () => {
      portal.target = '.square2';
      portal.bind(bindingContext, overrideContext);

      portal.attached();
      expect(document.querySelector('.square2 form')).not.toBeFalsy();

      portal.target = '.square3';
      portal.targetChanged();
      expect(document.querySelector('.square2 form')).toBeFalsy();
      expect(document.querySelector('.square3 form')).not.toBeFalsy();
    });

    it('throws in strict mode', () => {
      portal.strict = true;
      portal.target = '.square4';
      portal.bind(bindingContext, overrideContext);

      expect(() => portal.attached()).toThrow();
    });

    it('call detached()', () => {
      portal.bind(bindingContext, overrideContext);
      portal.attached();

      spyOn(view, 'detached').and.callThrough();
      portal.detached();
      expect(view.detached).toHaveBeenCalled();
    });
  });

  it('un-renders', () => {
    portal.bind(bindingContext, overrideContext);
    portal.attached();

    expect(document.querySelector('form')).not.toBeFalsy();

    portal.detached();
    portal.unbind();
    expect(document.querySelector('form')).toBeFalsy();
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
