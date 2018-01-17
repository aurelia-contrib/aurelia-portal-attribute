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

  private isAttached: boolean;
  private viewSlot: ViewSlot | null;
  private view: View;

  constructor(
    private viewFactory: BoundViewFactory,
    private originalViewslot: ViewSlot
  ) {
  }

  public bind(bindingContext: any, overrideContext: OverrideContext) {
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
    this.render();
  }

  public detached() {
    this.isAttached = false;
    this.view.detached();
  }

  public unbind() {
    this.viewSlot!.remove(this.view);
    this.view.unbind();
    this.viewSlot = null;
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
    const view = this.view;
    const target = this.getTarget();
    const oldViewSlot = this.viewSlot;
    if (oldViewSlot) {
      oldViewSlot.removeAt(0, false, false);
      if (this.isAttached) {
        view.detached();
      }
    }
    if (this.isAttached) {
      const viewSlot = this.viewSlot = new ViewSlot(target!, true);
      viewSlot.attached();
      viewSlot.add(view);
    }
  }

  public targetChanged() {
    this.render();
  }
}
