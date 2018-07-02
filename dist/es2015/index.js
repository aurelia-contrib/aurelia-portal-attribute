import { customAttribute, templateController, ViewSlot, BoundViewFactory, bindable } from 'aurelia-templating';
import { PLATFORM } from 'aurelia-pal';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const document = PLATFORM.global.document;
let Portal = Portal_1 = class Portal {
    constructor(viewFactory, originalViewslot) {
        this.viewFactory = viewFactory;
        this.originalViewslot = originalViewslot;
        this.strict = false;
        this.initialRender = false;
        this.currentTarget = unset;
    }
    static getTarget(target, context) {
        if (target) {
            if (typeof target === 'string') {
                let queryContext = document;
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
    bind(bindingContext, overrideContext) {
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
    attached() {
        this.isAttached = true;
        return this.render();
    }
    detached() {
        this.isAttached = false;
        if (this.viewSlot) {
            this.viewSlot.detached();
        }
    }
    unbind() {
        if (this.viewSlot) {
            this.viewSlot.remove(this.view);
            this.viewSlot = null;
        }
        this.view.unbind();
        this.callbackContext = null;
    }
    getTarget() {
        let target = Portal_1.getTarget(this.target, this.renderContext);
        if (target === null) {
            if (this.strict) {
                throw new Error('Render target not found.');
            }
            else {
                target = document.body;
            }
        }
        return target;
    }
    render() {
        const oldTarget = this.currentTarget;
        const view = this.view;
        const target = this.currentTarget = this.getTarget();
        const oldViewSlot = this.viewSlot;
        if (oldTarget === target && oldViewSlot) {
            return;
        }
        let addAction = () => {
            if (this.isAttached) {
                return Promise.resolve(typeof this.activating === 'function'
                    ? this.activating.call(this.callbackContext, target, view)
                    : null).then(() => {
                    if (target === this.currentTarget || oldTarget === unset) {
                        const viewSlot = this.viewSlot = new ViewSlot(target, true);
                        viewSlot.attached();
                        viewSlot.add(view);
                        this.removed = false;
                    }
                    return Promise.resolve().then(() => {
                        typeof this.activated === 'function'
                            ? this.activated.call(this.callbackContext, target, view)
                            : null;
                    });
                });
            }
            return Promise.resolve(null);
        };
        if (oldViewSlot) {
            return Promise.resolve(typeof this.deactivating === 'function'
                ? this.deactivating.call(this.callbackContext, oldTarget, view)
                : null).then(() => {
                if (typeof this.deactivated === 'function') {
                    this.deactivated.call(this.callbackContext, oldTarget, view);
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
    targetChanged() {
        return this.render();
    }
};
/**
 * Only needs the BoundViewFactory as a custom viewslot will be used
 */
Portal.inject = [BoundViewFactory, ViewSlot];
__decorate([
    bindable({
        primaryProperty: true,
        defaultValue: null
    })
], Portal.prototype, "target", void 0);
__decorate([
    bindable({ changeHandler: 'targetChanged' })
], Portal.prototype, "renderContext", void 0);
__decorate([
    bindable()
], Portal.prototype, "strict", void 0);
__decorate([
    bindable()
], Portal.prototype, "initialRender", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivating", void 0);
__decorate([
    bindable()
], Portal.prototype, "activating", void 0);
__decorate([
    bindable()
], Portal.prototype, "activated", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivated", void 0);
__decorate([
    bindable()
], Portal.prototype, "callbackContext", void 0);
Portal = Portal_1 = __decorate([
    templateController(),
    customAttribute('portal')
], Portal);
const unset = {};
var Portal_1;

function configure(frameworkConfig) {
    frameworkConfig.globalResources(Portal);
}

export { configure, Portal };
