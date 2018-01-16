import { OverrideContext } from 'aurelia-binding';
import { ViewSlot, BoundViewFactory } from 'aurelia-templating';
export declare class Portal {
    private viewFactory;
    private originalViewslot;
    private static getTarget(target);
    /**
     * Only needs the BoundViewFactory as a custom viewslot will be used
     */
    static inject: (typeof ViewSlot | typeof BoundViewFactory)[];
    /**
     * Target to render to, CSS string | Element
     */
    target: string | Element | null | undefined;
    strict: boolean;
    initialRender: boolean;
    private isAttached;
    private viewSlot;
    private view;
    constructor(viewFactory: BoundViewFactory, originalViewslot: ViewSlot);
    bind(bindingContext: any, overrideContext: OverrideContext): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    private getTarget();
    private render();
    targetChanged(): void;
}
