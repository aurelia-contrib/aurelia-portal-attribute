import { OverrideContext } from 'aurelia-binding';
import { ViewSlot, BoundViewFactory, View } from 'aurelia-templating';
export declare type PortalLifecycleCallback = (target: Element, view: View) => Promise<any> | any;
export declare class Portal {
    private viewFactory;
    private originalViewslot;
    private static getTarget(target, context?);
    /**
     * Only needs the BoundViewFactory as a custom viewslot will be used
     */
    static inject: (typeof ViewSlot | typeof BoundViewFactory)[];
    /**
     * Target to render to, CSS string | Element
     */
    target: string | Element | null | undefined;
    renderContext: string | Element | null | undefined;
    strict: boolean;
    initialRender: boolean;
    /**
     * Will be called when the attribute receive new target after the first render.
     */
    deactivating: PortalLifecycleCallback;
    /**
     * Will be called after `portaled` element has been added to target
     */
    activating: PortalLifecycleCallback;
    /**
     * Will be called after activating has been resolved
     */
    activated: PortalLifecycleCallback;
    /**
     * Will be called after deactivating has been resolved.
     */
    deactivated: PortalLifecycleCallback;
    /**
     * The object that will becontextwhen calling life cycle methods above
     */
    callbackContext: any;
    private currentTarget;
    private isAttached;
    private viewSlot;
    private view;
    private removed;
    constructor(viewFactory: BoundViewFactory, originalViewslot: ViewSlot);
    bind(bindingContext: any, overrideContext: OverrideContext): void;
    attached(): Promise<void | null> | undefined;
    detached(): void;
    unbind(): void;
    private getTarget();
    private render();
    targetChanged(): Promise<void | null> | undefined;
}
