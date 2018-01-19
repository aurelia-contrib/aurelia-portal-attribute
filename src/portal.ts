import { OverrideContext } from 'aurelia-binding';
import {
  customAttribute,
  templateController,
  ViewSlot,
  BoundViewFactory,
  bindable,
  View
} from 'aurelia-templating';
import { PLATFORM } from 'aurelia-pal';

const document: Document = PLATFORM.global.document;

type PortalTarget = string | Element | null | undefined

export type PortalLifecycleCallback = (target: Element, view: View) => Promise<any> | any;

@templateController()
@customAttribute('portal')
export class Portal {

  private static getTarget(target: PortalTarget, context?: PortalTarget): Element | null {
    if (target) {
      if (typeof target === 'string') {
        let queryContext: Element | Document = document;
        if (context) {
          if (typeof context === 'string') {
            context = document.querySelector(context);
          }
          if (context instanceof Element) {
            queryContext = context;
          }
        }
        target = queryContext.querySelector(target);
      }
      if (target instanceof Element) {
        return target;
      }
    }
    return null;
  }

  /**
   * Only needs the BoundViewFactory as a custom viewslot will be used
   */
  public static inject = [BoundViewFactory, ViewSlot];

  /**
   * Target to render to, CSS string | Element
   */
  @bindable({
    primaryProperty: true,
    defaultValue: null
  })
  public target: string | Element | null | undefined;

  @bindable({ changeHandler: 'targetChanged' }) public renderContext: string | Element | null | undefined;
  @bindable() public strict: boolean = false;
  @bindable() public initialRender: boolean = false;

  /**
   * Will be called when the attribute receive new target after the first render.
   */
  @bindable() public deactivating: PortalLifecycleCallback
  /**
   * Will be called after `portaled` element has been added to target
   */
  @bindable() public activating: PortalLifecycleCallback
  /**
   * Will be called after activating has been resolved
   */
  @bindable() public activated: PortalLifecycleCallback
  /**
   * Will be called after deactivating has been resolved.
   */
  @bindable() public deactivated: PortalLifecycleCallback
  /**
   * The object that will becontextwhen calling life cycle methods above
   */
  @bindable() public callbackContext: any

  private currentTarget: typeof unset | Element | null = unset;
  private isAttached: boolean;
  private viewSlot: ViewSlot | null;
  private view: View;
  private removed: boolean;

  constructor(
    private viewFactory: BoundViewFactory,
    private originalViewslot: ViewSlot
  ) {
  }

  public bind(bindingContext: any, overrideContext: OverrideContext) {
    if (!this.callbackContext) {
      this.callbackContext = bindingContext;
    }
    let view = this.view;
    if (!view) {
      view = this.view = this.viewFactory.create();
    }
    const shouldInitRender = this.initialRender;
    if (shouldInitRender) {
      this.originalViewslot.add(view);
    }
    view.bind(bindingContext, overrideContext);
    if (shouldInitRender) {
      this.originalViewslot.remove(view);
    }
  }

  public attached() {
    this.isAttached = true;
    return this.render();
  }

  public detached() {
    this.isAttached = false;
    if (this.viewSlot) {
      this.viewSlot.detached();
    }
  }

  public unbind() {
    if (this.viewSlot) {
      this.viewSlot.remove(this.view);
      this.viewSlot = null;
    }
    this.view.unbind();
    this.callbackContext = null;
  }

  private getTarget(): Element | null {
    let target = Portal.getTarget(this.target, this.renderContext);
    if (target === null) {
      if (this.strict) {
        throw new Error('Render target not found.');
      } else {
        target = document.body;
      }
    }
    return target;
  }

  private render() {
    const oldTarget = this.currentTarget;
    const view = this.view;
    const target = this.currentTarget = this.getTarget();
    const oldViewSlot = this.viewSlot;

    if (oldTarget === target && oldViewSlot) {
      return;
    }

    let addAction = () => {
      if (this.isAttached) {
        return Promise.resolve(
          typeof this.activating === 'function'
            ? this.activating.call(this.callbackContext, target!, view)
            : null
        ).then(() => {
          if (target === this.currentTarget || oldTarget === unset) {
            const viewSlot = this.viewSlot = new ViewSlot(target!, true);
            viewSlot.attached();
            viewSlot.add(view);
            this.removed = false;
          }
          return Promise.resolve().then(() => {
            typeof this.activated === 'function'
              ? this.activated.call(this.callbackContext, target!, view)
              : null
          });
        });
      }
      return Promise.resolve(null);
    }

    if (oldViewSlot) {
      return Promise.resolve(
        typeof this.deactivating === 'function'
          ? this.deactivating.call(this.callbackContext, oldTarget as Element, view)
          : null
      ).then(() => {
        if (typeof this.deactivated === 'function') {
          this.deactivated.call(this.callbackContext, oldTarget as Element, view);
        }
        this.viewSlot = null;
        if (!this.removed) {
          oldViewSlot.remove(view);
          this.removed = true;
        }
        return addAction();
      });
    }
    return Promise.resolve(addAction());
  }

  public targetChanged() {
    return this.render();
  }
}

const unset = {};
