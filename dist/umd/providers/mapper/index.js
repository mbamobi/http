(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./transform", "./mapper", "./model/simple", "./model/collection", "./model/multiple"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./transform"));
    __export(require("./mapper"));
    __export(require("./model/simple"));
    __export(require("./model/collection"));
    __export(require("./model/multiple"));
});
//# sourceMappingURL=index.js.map