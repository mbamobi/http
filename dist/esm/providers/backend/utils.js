var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
export var isSuccess = function (status) { return (status >= 200 && status < 300); };
import { Injectable } from '@angular/core';
var Events = (function () {
    function Events() {
        this.channels = [];
    }
    Events.prototype.subscribe = function (topic) {
        var _this = this;
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        if (!this.channels[topic]) {
            this.channels[topic] = [];
        }
        handlers.forEach(function (handler) {
            _this.channels[topic].push(handler);
        });
    };
    Events.prototype.unsubscribe = function (topic, handler) {
        if (handler === void 0) { handler = null; }
        var t = this.channels[topic];
        if (!t) {
            return false;
        }
        if (!handler) {
            delete this.channels[topic];
            return true;
        }
        var i = t.indexOf(handler);
        if (i < 0) {
            return false;
        }
        t.splice(i, 1);
        if (!t.length) {
            delete this.channels[topic];
        }
        return true;
    };
    Events.prototype.publish = function (topic) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var t = this.channels[topic];
        if (!t) {
            return null;
        }
        var responses = [];
        t.forEach(function (handler) {
            responses.push(handler.apply(null, args));
        });
        return responses;
    };
    Events.decorators = [
        { type: Injectable },
    ];
    Events.ctorParameters = function () { return []; };
    return Events;
}());
export { Events };
var HttpEvents = (function (_super) {
    __extends(HttpEvents, _super);
    function HttpEvents() {
        return _super.call(this) || this;
    }
    HttpEvents.prototype.preRequest = function (req, subscribe) {
        this.publish(HttpEvents.PRE_REQUEST, req, subscribe);
    };
    HttpEvents.prototype.postRequest = function (resp) {
        this.publish(HttpEvents.POST_REQUEST, resp);
    };
    HttpEvents.prototype.postRequestSuccess = function (resp) {
        this.publish(HttpEvents.POST_REQUEST_SUCCESS, resp);
    };
    HttpEvents.prototype.postRequestError = function (resp) {
        this.publish(HttpEvents.POST_REQUEST_ERROR, resp);
    };
    HttpEvents.prototype.onPreRequest = function (callback) {
        this.subscribe(HttpEvents.PRE_REQUEST, callback);
    };
    HttpEvents.prototype.onPostRequest = function (callback) {
        this.subscribe(HttpEvents.POST_REQUEST, callback);
    };
    HttpEvents.prototype.onPostRequestSuccess = function (callback) {
        this.subscribe(HttpEvents.POST_REQUEST_SUCCESS, callback);
    };
    HttpEvents.prototype.onPostRequestError = function (callback) {
        this.subscribe(HttpEvents.POST_REQUEST_ERROR, callback);
    };
    HttpEvents.PRE_REQUEST = 'http.prerequest';
    HttpEvents.POST_REQUEST = 'http.postrequest';
    HttpEvents.POST_REQUEST_SUCCESS = 'http.postrequest_success';
    HttpEvents.POST_REQUEST_ERROR = 'http.postrequest_error';
    return HttpEvents;
}(Events));
export { HttpEvents };
//# sourceMappingURL=utils.js.map