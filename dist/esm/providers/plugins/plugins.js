import { Injectable, OpaqueToken, Optional } from '@angular/core';
import { HttpEvents } from '../backend/utils';
export var HttpPluginsToken = new OpaqueToken('HTTP_PLUGINS');
var EventsMethods = ['preRequest', 'postRequest', 'postRequestSuccess', 'postRequestError'];
var AllPlugins = '*';
var Plugins = (function () {
    function Plugins(events, plugins) {
        this.events = events;
        this.plugins = [];
        this.options = {};
        if (plugins) {
            this.set(plugins);
        }
        this.callEvent('preRequest');
        this.callEvent('postRequest');
        this.callEvent('postRequestSuccess');
        this.callEvent('postRequestError');
    }
    Plugins.prototype.callEvent = function (method) {
        var _this = this;
        var methodName = [
            'on',
            method.charAt(0).toUpperCase(),
            method.slice(1)
        ].join('');
        this.events[methodName].call(this.events, function (req, subscribe) {
            _this.runEvent(method, [req, subscribe]);
            if (method === 'postRequest') {
                _this.cleanOptions(method);
            }
        });
    };
    Plugins.prototype.set = function (plugins) {
        this.plugins = [];
        for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
            var plugin = plugins_1[_i];
            this.add(plugin);
        }
        return this;
    };
    Plugins.prototype.add = function (plugin, priority) {
        var implementsInterfaces = false;
        for (var _i = 0, EventsMethods_1 = EventsMethods; _i < EventsMethods_1.length; _i++) {
            var method = EventsMethods_1[_i];
            if (method in plugin) {
                implementsInterfaces = true;
            }
        }
        if (implementsInterfaces === false) {
            throw 'Plugin not implements interface of events (preRequest, postRequest ...).';
        }
        var pluginConf = {};
        pluginConf[plugin.getName()] = plugin;
        if (!priority) {
            priority = plugin.getPriority();
        }
        if (this.plugins[priority]) {
            this.plugins.splice(priority, 0, pluginConf);
        }
        else {
            this.plugins[priority] = pluginConf;
        }
        this.plugins.filter(function (value) { return value !== undefined || value !== null; });
        return this;
    };
    Plugins.prototype.get = function (name) {
        var index = this.indexOf(name);
        if (index !== -1) {
            return this.plugins[index][name];
        }
        return null;
    };
    Plugins.prototype.has = function (name) {
        return this.indexOf(name) !== -1 ? true : false;
    };
    Plugins.prototype.indexOf = function (name) {
        for (var index = 0, length_1 = this.plugins.length; index < length_1; index++) {
            var plugin = this.plugins[index];
            if (plugin[name]) {
                return index;
            }
        }
        return -1;
    };
    Plugins.prototype.remove = function (name) {
        var index = this.indexOf(name);
        if (index !== -1) {
            this.plugins.splice(index, 1);
            return true;
        }
        return false;
    };
    Plugins.prototype.getAll = function () {
        return this.plugins;
    };
    Plugins.prototype.forEach = function (fn) {
        var i = 0;
        for (var _i = 0, _a = this.plugins; _i < _a.length; _i++) {
            var object = _a[_i];
            for (var name_1 in object) {
                var fnBreak = fn(object[name_1], i++);
                if (fnBreak === false) {
                    return;
                }
            }
        }
    };
    Plugins.prototype.cleanOptions = function (event) {
        var _this = this;
        this.forEach(function (plugin) {
            if ('restoreOptions' in plugin) {
                if (event && event in plugin) {
                    plugin.restoreOptions();
                }
            }
            _this.options[plugin.getName()] = {};
        });
    };
    Plugins.prototype.setOptions = function (options) {
        var _this = this;
        var keys = Object.keys(options);
        if (keys.indexOf(AllPlugins) !== -1) {
            this.forEach(function (plugin) {
                if ('setOptions' in plugin) {
                    plugin.setOptions(options[AllPlugins]);
                }
                _this.options[plugin.getName()] = options[AllPlugins];
            });
            delete options[AllPlugins];
        }
        for (var pluginName in options) {
            if (!this.has(pluginName)) {
                throw new Error('Plugin not exists');
            }
            var plugin = this.get(pluginName);
            if ('setOptions' in plugin) {
                plugin.setOptions(options[pluginName]);
            }
            this.options[plugin.getName()] = options[pluginName];
        }
        this.options = options;
        return this;
    };
    Plugins.prototype.runEvent = function (event, params) {
        if (EventsMethods.indexOf(event) === -1) {
            throw new Error("Event '" + event + "' not exists");
        }
        this.forEach(function (plugin) {
            if (!(event in plugin)) {
                return;
            }
            try {
                var method = plugin[event];
                method.apply(plugin, params);
            }
            catch (ex) {
                if (plugin.getThrowsException && plugin.getThrowsException()) {
                    var callbackException = plugin.getThrowsException();
                    if (typeof callbackException === 'function') {
                        callbackException(ex);
                        return;
                    }
                    throw ex;
                }
            }
        });
    };
    Plugins.decorators = [
        { type: Injectable },
    ];
    Plugins.ctorParameters = function () { return [
        { type: HttpEvents, },
        { type: Array, decorators: [{ type: Optional },] },
    ]; };
    return Plugins;
}());
export { Plugins };
//# sourceMappingURL=plugins.js.map