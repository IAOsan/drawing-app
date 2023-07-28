"use strict";
exports.__esModule = true;
exports.hexToRgb = exports.getClassName = void 0;
function getClassName() {
    var str = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        str[_i] = arguments[_i];
    }
    return str
        .reduce(function (acc, s) {
        if (!s)
            return acc;
        var isAnString = typeof s === 'string';
        var isANumber = typeof s === 'number';
        var isAnObject = typeof s === 'object' && s !== null;
        if (isAnString || isANumber) {
            acc.push(s.toString());
        }
        if (isAnObject) {
            var _a = Object.entries(s)[0], key = _a[0], value = _a[1];
            acc = acc.concat(value ? key : []);
        }
        return acc;
    }, [])
        .join(' ');
}
exports.getClassName = getClassName;
function hexToRgb(color) {
    var isHexColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    if (!isHexColor.test(color))
        return {};
    var hex = color.slice(1);
    // If the color is only 3 characters, expand it to 6 characters by doubling each character
    var expandedHex = hex.length === 3
        ? hex
            .split('')
            .map(function (c) { return c + c; })
            .join('')
        : hex;
    var r = parseInt(expandedHex.slice(0, 2), 16);
    var g = parseInt(expandedHex.slice(2, 4), 16);
    var b = parseInt(expandedHex.slice(4), 16);
    return { r: r, g: g, b: b };
}
exports.hexToRgb = hexToRgb;
