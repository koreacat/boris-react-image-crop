import { jsx as _jsx } from "react/jsx-runtime";
import { clamp } from './data';
import styles from './imageCrop.module.scss';
import classnames from 'classnames/bind';
var cx = classnames.bind(styles);
var DimmedBox = function (_a) {
    var imgSize = _a.imgSize, setOffset = _a.setOffset, setCropBoxSize = _a.setCropBoxSize;
    var getOffsetTop = function () {
        return (window.innerHeight - 512) / 2 + (512 - imgSize.h) / 2;
    };
    var getOffsetLeft = function () {
        return (window.innerWidth - imgSize.w) / 2;
    };
    var startSetCropBox = function (e) {
        e.preventDefault();
        var startPoint = { x: e.clientX, y: e.clientY };
        var initCropBox = function () {
            setOffset({
                x: startPoint.x - getOffsetLeft(),
                y: startPoint.y - getOffsetTop(),
            });
            setCropBoxSize({ w: 0, h: 0 });
        };
        var setCropBox = function (e) {
            initCropBox();
            var w = e.clientX - startPoint.x;
            var h = e.clientY - startPoint.y;
            var x = startPoint.x - getOffsetLeft();
            var y = startPoint.y - getOffsetTop();
            var offsetX = (w < 0 ? e.clientX : startPoint.x) - getOffsetLeft();
            var offsetY = (h < 0 ? e.clientY : startPoint.y) - getOffsetTop();
            var maxCropBoxW = w < 0 ? x : imgSize.w - x;
            var maxCropBoxH = h < 0 ? y : imgSize.h - y;
            var cropBoxW = clamp(Math.abs(w), 0, maxCropBoxW);
            var cropBoxH = clamp(Math.abs(h), 0, maxCropBoxH);
            setOffset({ x: Math.max(offsetX, 0), y: Math.max(offsetY, 0) });
            setCropBoxSize({ w: cropBoxW, h: cropBoxH });
        };
        var stopSetCropBox = function () {
            document.removeEventListener('mousemove', setCropBox);
            document.removeEventListener('mouseup', stopSetCropBox);
        };
        document.addEventListener('mousemove', setCropBox);
        document.addEventListener('mouseup', stopSetCropBox);
    };
    return (_jsx("div", { className: cx('dimmedBox'), onMouseDown: startSetCropBox, style: {
            width: "".concat(imgSize.w, "px"),
            height: "".concat(imgSize.h, "px"),
        } }));
};
export default DimmedBox;
