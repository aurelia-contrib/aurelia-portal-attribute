import { ViewSlot, BoundViewFactory, View } from 'aurelia-templating';
/**
 * Indicates where to insert a portalled view. Aligns with webapi for insertion
 */
declare type InsertPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
export declare type PortalLifecycleCallback = (target: Element, view: View) => Promise<any> | any;
export declare class Portal {
    /**
     * Target to render to, CSS string | Element
     */
    target: string | Element | null | undefined;
    /**
     * Insertion position. See https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
     * for explanation of what the possible values mean.
     *
     * Possible values are (case insensitive): `beforeBegin` | `afterBegin` | `beforeEnd` | `afterEnd`
     *
     * Default value is `beforeEnd`
     */
    position: InsertPosition;
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
    constructor(
    /**@internal */
    viewFactory: BoundViewFactory, 
    /**@internal */
    originalViewslot: ViewSlot);
}
export {};
