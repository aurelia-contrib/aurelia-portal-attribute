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

@templateController()
@customAttribute('portal')
export class Portal {

  private static getTarget(target: string | Element | null | undefined): Element | null {
    if (target) {
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }
      if (target && (target instanceof Element)) {
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
    const view = this.view = this.viewFactory.create();
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
    let target = Portal.getTarget(this.target);
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
      oldViewSlot.remove(view);
      if (this.isAttached) {
        view.detached();
      }
    }
    if (this.isAttached) {
      const viewSlot = this.viewSlot = new ViewSlot(target!, true);
      viewSlot.add(view);
      view.attached();
    }
  }

  public targetChanged() {
    this.render();
  }
}
