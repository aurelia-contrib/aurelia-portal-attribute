"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_templating_1 = require("aurelia-templating");
var aurelia_pal_1 = require("aurelia-pal");
var document = aurelia_pal_1.PLATFORM.global.document;
var Portal = /** @class */ (function () {
    function Portal(viewFactory, originalViewslot) {
        this.viewFactory = viewFactory;
        this.originalViewslot = originalViewslot;
        this.strict = false;
        this.initialRender = false;
    }
    Portal_1 = Portal;
    Portal.getTarget = function (target) {
        if (target) {
            if (typeof target === 'string') {
                target = document.querySelector(target);
            }
            if (target && (target instanceof Element)) {
                return target;
            }
        }
        return null;
    };
    Portal.prototype.bind = function (bindingContext, overrideContext) {
        var view = this.view = this.viewFactory.create();
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
        this.render();
    };
    Portal.prototype.detached = function () {
        this.isAttached = false;
        this.view.detached();
    };
    Portal.prototype.unbind = function () {
        this.viewSlot.remove(this.view);
        this.view.unbind();
        this.viewSlot = null;
    };
    Portal.prototype.getTarget = function () {
        var target = Portal_1.getTarget(this.target);
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
        var view = this.view;
        var target = this.getTarget();
        var oldViewSlot = this.viewSlot;
        if (oldViewSlot) {
            oldViewSlot.remove(view);
            if (this.isAttached) {
                view.detached();
            }
        }
        if (this.isAttached) {
            var viewSlot = this.viewSlot = new aurelia_templating_1.ViewSlot(target, true);
            viewSlot.add(view);
            view.attached();
        }
    };
    Portal.prototype.targetChanged = function () {
        this.render();
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
        aurelia_templating_1.bindable()
    ], Portal.prototype, "strict", void 0);
    __decorate([
        aurelia_templating_1.bindable()
    ], Portal.prototype, "initialRender", void 0);
    Portal = Portal_1 = __decorate([
        aurelia_templating_1.templateController(),
        aurelia_templating_1.customAttribute('portal')
    ], Portal);
    return Portal;
    var Portal_1;
}());
exports.Portal = Portal;
