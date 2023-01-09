var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export var ORIGIN_POINT = Object.freeze({ x: 0, y: 0 });
export var ORIGIN_SIZE = Object.freeze({ w: 0, h: 0 });
var DIR;
(function (DIR) {
    DIR["e"] = "e";
    DIR["w"] = "w";
    DIR["s"] = "s";
    DIR["n"] = "n";
    DIR["se"] = "se";
    DIR["sw"] = "sw";
    DIR["ne"] = "ne";
    DIR["nw"] = "nw";
})(DIR || (DIR = {}));
export var LINE_DIR = ['e', 'w', 's', 'n'];
export var POINT_DIR = __spreadArray([], Object.keys(DIR), true);
export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
