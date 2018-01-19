var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-templating", "aurelia-pal"], function (require, exports, aurelia_templating_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var document = aurelia_pal_1.PLATFORM.global.document;
    var Portal = /** @class */ (function () {
        function Portal(viewFactory, originalViewslot) {
            this.viewFactory = viewFactory;
            this.originalViewslot = originalViewslot;
            this.strict = false;
            this.initialRender = false;
            this.currentTarget = unset;
        }
        Portal_1 = Portal;
        Portal.getTarget = function (target, context) {
            if (target) {
                if (typeof target === 'string') {
                    var queryContext = document;
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
        };
        Portal.prototype.bind = function (bindingContext, overrideContext) {
            if (!this.callbackContext) {
                this.callbackContext = bindingContext;
            }
            var view = this.view;
            if (!view) {
                view = this.view = this.viewFactory.create();
            }
            var shouldInitRender = this.initialRender;
            if (shouldInitRender) {
                this.originalViewslot.add(view);
            }
            view.bind(bindingContext, overrideContext);
            if (shouldInitRender) {
                this.originalViewslot.remove(view);
            }
        };
        Portal.prototype.attached = function () {
            this.isAttached = true;
            return this.render();
        };
        Portal.prototype.detached = function () {
            this.isAttached = false;
            if (this.viewSlot) {
                this.viewSlot.detached();
            }
        };
        Portal.prototype.unbind = function () {
            if (this.viewSlot) {
                this.viewSlot.remove(this.view);
                this.viewSlot = null;
            }
            this.view.unbind();
            this.callbackContext = null;
        };
        Portal.prototype.getTarget = function () {
            var target = Portal_1.getTarget(this.target, this.renderContext);
            if (target === null) {
                if (this.strict) {
                    throw new Error('Render target not found.');
                }
                else {
                    target = document.body;
                }
            }
            return target;
        };
        Portal.prototype.render = function () {
            var _this = this;
            var oldTarget = this.currentTarget;
            var view = this.view;
            var target = this.currentTarget = this.getTarget();
            var oldViewSlot = this.viewSlot;
            if (oldTarget === target && oldViewSlot) {
                return;
            }
            var addAction = function () {
                if (_this.isAttached) {
                    return Promise.resolve(typeof _this.activating === 'function'
                        ? _this.activating.call(_this.callbackContext, target, view)
                        : null).then(function () {
                        if (target === _this.currentTarget || oldTarget === unset) {
                            var viewSlot = _this.viewSlot = new aurelia_templating_1.ViewSlot(target, true);
                            viewSlot.attached();
                            viewSlot.add(view);
                            _this.removed = false;
                        }
                        return Promise.resolve().then(function () {
                            typeof _this.activated === 'function'
                                ? _this.activated.call(_this.callbackContext, target, view)
                                : null;
                        });
                    });
                }
                return Promise.resolve(null);
            };
            if (oldViewSlot) {
                return Promise.resolve(typeof this.deactivating === 'function'
                    ? this.deactivating.call(this.callbackContext, oldTarget, view)
                    : null).then(function () {
                    if (typeof _this.deactivated === 'function') {
                        _this.deactivated.call(_this.callbackContext, oldTarget, view);
                    }
                    _this.viewSlot = null;
                    if (!_this.removed) {
                        oldViewSlot.remove(view);
                        _this.removed = true;
                    }
                    return addAction();
                });
            }
            return Promise.resolve(addAction());
        };
        Portal.prototype.targetChanged = function () {
            return this.render();
        };
        /**
         * Only needs the BoundViewFactory as a custom viewslot will be used
         */
        Portal.inject = [aurelia_templating_1.BoundViewFactory, aurelia_templating_1.ViewSlot];
        __decorate([
            aurelia_templating_1.bindable({
                primaryProperty: true,
                defaultValue: null
            })
        ], Portal.prototype, "target", void 0);
        __decorate([
            aurelia_templating_1.bindable({ changeHandler: 'targetChanged' })
        ], Portal.prototype, "renderContext", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "strict", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "initialRender", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "deactivating", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "activating", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "activated", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "deactivated", void 0);
        __decorate([
            aurelia_templating_1.bindable()
        ], Portal.prototype, "callbackContext", void 0);
        Portal = Portal_1 = __decorate([
            aurelia_templating_1.templateController(),
            aurelia_templating_1.customAttribute('portal')
        ], Portal);
        return Portal;
        var Portal_1;
    }());
    exports.Portal = Portal;
    var unset = {};
});
