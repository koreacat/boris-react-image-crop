var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './imageCrop.module.scss';
import classnames from 'classnames/bind';
import { useRef } from 'react';
import { ORIGIN_POINT, LINE_DIR, POINT_DIR, clamp } from './data';
var cx = classnames.bind(styles);
function diffPoints(p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
}
function addPoints(p1, p2, minX, minY, maxX, maxY) {
    if (minX === void 0) { minX = 0; }
    if (minY === void 0) { minY = 0; }
    if (maxX === void 0) { maxX = 0; }
    if (maxY === void 0) { maxY = 0; }
    var x = p1.x + p2.x;
    var y = p1.y + p2.y;
    return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
}
var CropBox = function (_a) {
    var imgSrc = _a.imgSrc, imgSize = _a.imgSize, offset = _a.offset, setOffset = _a.setOffset, cropBoxSize = _a.cropBoxSize, setCropBoxSize = _a.setCropBoxSize;
    var lastMousePosRef = useRef(ORIGIN_POINT);
    var getEdgeWidth = function () { return imgSize.w - cropBoxSize.w; };
    var getEdgeHeight = function () { return imgSize.h - cropBoxSize.h; };
    var getOffsetTop = function () {
        return (window.innerHeight - 666) / 2 + 106 + (560 - imgSize.h) / 2;
    };
    var getOffsetLeft = function () {
        return (window.innerWidth - imgSize.w) / 2;
    };
    var startPan = function (e) {
        e.preventDefault();
        document.addEventListener('mousemove', moveCropBox);
        document.addEventListener('mouseup', stopPan);
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    var moveCropBox = function (e) {
        var lastMousePos = lastMousePosRef.current;
        var currentMousePos = { x: e.clientX, y: e.clientY };
        var mouseDiff = diffPoints(currentMousePos, lastMousePos);
        lastMousePosRef.current = currentMousePos;
        setOffset(function (prevOffset) { return addPoints(prevOffset, mouseDiff, 0, 0, getEdgeWidth(), getEdgeHeight()); });
    };
    var stopPan = function () {
        document.removeEventListener('mousemove', moveCropBox);
        document.removeEventListener('mouseup', stopPan);
    };
    var startSetCropBox = function (e, dir) {
        e.preventDefault();
        var eLineX = offset.x + cropBoxSize.w;
        var wLineX = offset.x;
        var sLineY = offset.y + cropBoxSize.h;
        var nLineY = offset.y;
        var setCropBox = function (e) {
            var startPoint = { x: e.clientX, y: e.clientY };
            setBox({
                x: clamp(startPoint.x - getOffsetLeft(), 0, imgSize.w),
                y: clamp(startPoint.y - getOffsetTop(), 0, imgSize.h)
            });
        };
        var setBox = function (currentMousePos) {
            var isCrossEL = !(wLineX + cropBoxSize.w > currentMousePos.x);
            var isCrossWL = eLineX - cropBoxSize.w > currentMousePos.x;
            var isCrossSL = !(nLineY + cropBoxSize.h > currentMousePos.y);
            var isCrossNL = sLineY - cropBoxSize.h > currentMousePos.y;
            var eXOffset = eLineX - cropBoxSize.w - (offset.x - currentMousePos.x);
            var wXOffset = wLineX - (offset.x - currentMousePos.x);
            var sYOffset = sLineY - cropBoxSize.h - (offset.y - currentMousePos.y);
            var nYOffset = nLineY - (offset.y - currentMousePos.y);
            var eCrossW = eLineX - cropBoxSize.w - currentMousePos.x;
            var wCrossW = currentMousePos.x - wLineX - cropBoxSize.w;
            var sCrossH = sLineY - cropBoxSize.h - currentMousePos.y;
            var nCrossH = currentMousePos.y - nLineY - cropBoxSize.h;
            var eW = cropBoxSize.w + currentMousePos.x - eLineX;
            var wW = cropBoxSize.w + wLineX - currentMousePos.x;
            var sH = cropBoxSize.h + currentMousePos.y - sLineY;
            var nH = cropBoxSize.h + nLineY - currentMousePos.y;
            switch (dir) {
                case 'e':
                    if (isCrossWL) {
                        setOffset({ x: eXOffset, y: offset.y });
                        setCropBoxSize({ w: eCrossW, h: cropBoxSize.h });
                    }
                    else {
                        setCropBoxSize({ w: eW, h: cropBoxSize.h });
                    }
                    break;
                case 'w':
                    if (isCrossEL) {
                        setCropBoxSize({ w: wCrossW, h: cropBoxSize.h });
                    }
                    else {
                        setOffset({ x: wXOffset, y: offset.y });
                        setCropBoxSize({ w: wW, h: cropBoxSize.h });
                    }
                    break;
                case 's':
                    if (isCrossNL) {
                        setOffset({ x: offset.x, y: sYOffset });
                        setCropBoxSize({ w: cropBoxSize.w, h: sCrossH });
                    }
                    else {
                        setCropBoxSize({ w: cropBoxSize.w, h: sH });
                    }
                    break;
                case 'n':
                    if (isCrossSL) {
                        setCropBoxSize({ w: cropBoxSize.w, h: nCrossH });
                    }
                    else {
                        setOffset({ x: offset.x, y: nYOffset });
                        setCropBoxSize({ w: cropBoxSize.w, h: nH });
                    }
                    break;
                case 'se':
                    if (isCrossNL && isCrossWL) {
                        setOffset({ x: eXOffset, y: sYOffset });
                        setCropBoxSize({ w: eCrossW, h: sCrossH });
                    }
                    else if (isCrossWL) {
                        setOffset({ x: eXOffset, y: offset.y });
                        setCropBoxSize({ w: eCrossW, h: sH });
                    }
                    else if (isCrossNL) {
                        setOffset({ x: offset.x, y: sYOffset });
                        setCropBoxSize({ w: eW, h: sCrossH });
                    }
                    else {
                        setCropBoxSize({ w: eW, h: sH });
                    }
                    break;
                case 'sw':
                    if (isCrossNL && isCrossEL) {
                        setOffset({ x: offset.x + cropBoxSize.w, y: nYOffset });
                        setCropBoxSize({ w: wCrossW, h: sCrossH });
                    }
                    else if (isCrossEL) {
                        setCropBoxSize({ w: wCrossW, h: sH });
                    }
                    else if (isCrossNL) {
                        setOffset({ x: wXOffset, y: nYOffset });
                        setCropBoxSize({ w: wW, h: sCrossH });
                    }
                    else {
                        setOffset({ x: wXOffset, y: offset.y });
                        setCropBoxSize({ w: wW, h: sH });
                    }
                    break;
                case 'ne':
                    if (isCrossSL && isCrossWL) {
                        setOffset({ x: eXOffset, y: offset.y + cropBoxSize.h });
                        setCropBoxSize({ w: eCrossW, h: nCrossH });
                    }
                    else if (isCrossWL) {
                        setOffset({ x: eXOffset, y: nYOffset });
                        setCropBoxSize({ w: eCrossW, h: nH });
                    }
                    else if (isCrossSL) {
                        setCropBoxSize({ w: eW, h: nCrossH });
                    }
                    else {
                        setOffset({ x: offset.x, y: nYOffset });
                        setCropBoxSize({ w: eW, h: nH });
                    }
                    break;
                case 'nw':
                    if (isCrossSL && isCrossEL) {
                        setCropBoxSize({ w: wCrossW, h: nCrossH });
                    }
                    else if (isCrossEL) {
                        setOffset({ x: offset.x + cropBoxSize.w, y: nYOffset });
                        setCropBoxSize({ w: wCrossW, h: nH });
                    }
                    else if (isCrossSL) {
                        setOffset({ x: wXOffset, y: offset.y + cropBoxSize.h });
                        setCropBoxSize({ w: wW, h: nCrossH });
                    }
                    else {
                        setOffset({ x: wXOffset, y: nYOffset });
                        setCropBoxSize({ w: wW, h: nH });
                    }
                    break;
            }
        };
        var stopSetCropBox = function () {
            document.removeEventListener('mousemove', setCropBox);
            document.removeEventListener('mouseup', stopSetCropBox);
        };
        document.addEventListener('mousemove', setCropBox);
        document.addEventListener('mouseup', stopSetCropBox);
    };
    var getDash = function () { return ['w', 'h'].map(function (dir) { return _jsx("span", { className: cx('dash', dir) }, dir); }); };
    var getLine = function () {
        return LINE_DIR.map(function (dir) { return (_jsx("span", { className: cx('line', dir), onMouseDown: function (e) { return startSetCropBox(e, dir); } }, dir)); });
    };
    var getPoints = function () {
        return POINT_DIR.map(function (dir) { return (_jsx("span", { className: cx('point', dir), onMouseDown: function (e) { return startSetCropBox(e, dir); } }, dir)); });
    };
    return (_jsxs("div", __assign({ className: cx('cropBox'), style: {
            width: "".concat(cropBoxSize.w, "px"),
            height: "".concat(cropBoxSize.h, "px"),
            transform: "translateX(".concat(offset.x, "px) translateY(").concat(offset.y, "px)"),
        } }, { children: [_jsx("span", __assign({ className: cx('viewBox') }, { children: _jsx("img", { className: cx('viewImg'), src: imgSrc, alt: 'img', style: {
                        width: "".concat(imgSize.w, "px"),
                        height: "".concat(imgSize.h, "px"),
                        transform: "translateX(-".concat(offset.x, "px) translateY(-").concat(offset.y, "px)"),
                    } }) })), getDash(), _jsx("span", { className: cx('cross') }), _jsx("span", { className: cx('moveBox'), onMouseDown: startPan }), getLine(), getPoints(), _jsx("span", __assign({ className: cx('cropBoxInfo') }, { children: "\uB4DC\uB798\uADF8\uD558\uC5EC \uC704\uCE58\uB97C \uC870\uC815\uD574\uC8FC\uC138\uC694" }))] })));
};
export default CropBox;
