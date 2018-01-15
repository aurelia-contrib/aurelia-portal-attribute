export interface BlurConfig {
    touch?: boolean;
    mouse?: boolean;
    pointer?: boolean;
    focus?: boolean;
    windowBlur?: boolean;
}
export declare class Blur {
    private element;
    static inject: {
        new (): Element;
        prototype: Element;
    }[];
    static use(cfg: BlurConfig): void;
    static listen: {
        touch(on: boolean): any;
        mouse(on: boolean): any;
        pointer(on: boolean): any;
        focus(on: boolean): any;
        windowBlur(on: boolean): any;
    };
    value: boolean;
    onBlur: Function;
    /**
     * Used to determine which elemens this attribute will be linked with
     * Interacting with a linked element will not trigger blur for this attribute
     */
    linkedWith: string | Element | (string | Element)[];
    /**
     * Only used when linkedWith is a string.
     * Used to determine whether to use querySelector / querySelectorAll to find all interactable elements without triggering blur
     * Performace wise Consider using this only when necessary
     */
    linkedMultiple: boolean;
    /**
     * Only used when linkedWith is a string, or an array containing some strings
     * During query for finding element to link with:
     * - true: search all children, using `querySelectorAll`
     * - false: search immediate children using for loop
     */
    searchSubTree: boolean;
    /**
     * Only used when linkedWith is a string. or an array containing a string
     * Determine from which node/ nodes, search for elements
     */
    linkingContext: string | Element | null;
    constructor(element: Element);
    attached(): void;
    detached(): void;
    contains(target: Element): boolean;
    triggerBlur(): void;
}
