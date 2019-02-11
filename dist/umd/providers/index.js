(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./backend/xhr_backend", "./backend/utils", "./backend/http_plugin_backend", "./http", "./plugins", "./mapper", "./exception"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./backend/xhr_backend"));
    __export(require("./backend/utils"));
    __export(require("./backend/http_plugin_backend"));
    __export(require("./http"));
    __export(require("./plugins"));
    __export(require("./mapper"));
    __export(require("./exception"));
});
//# sourceMappingURL=index.js.map