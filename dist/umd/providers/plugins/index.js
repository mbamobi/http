(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./cancel-request-plugin", "./plugin-base", "./plugins", "./parse-response-plugin", "./response/parse-response", "./response/throw-exception-status"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./cancel-request-plugin"));
    __export(require("./plugin-base"));
    __export(require("./plugins"));
    __export(require("./parse-response-plugin"));
    __export(require("./response/parse-response"));
    __export(require("./response/throw-exception-status"));
});
//# sourceMappingURL=index.js.map