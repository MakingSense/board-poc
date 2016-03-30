var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
function randomString(length) {
    if (length === void 0) { length = 8; }
    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }
    var str = "";
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
exports.randomString = randomString;
function extend(dst) {
    var srcs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        srcs[_i - 1] = arguments[_i];
    }
    srcs.forEach(function (src) {
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                dst[prop] = src[prop];
            }
        }
    });
    return dst;
}
exports.extend = extend;
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.clone = clone;
