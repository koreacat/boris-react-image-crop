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
import { useEffect, useRef, useState } from 'react';
import { ORIGIN_POINT, ORIGIN_SIZE } from './data';
import styles from './imageCrop.module.scss';
import classnames from 'classnames/bind';
import DimmedBox from './DimmedBox';
import CropBox from './CropBox';
var cx = classnames.bind(styles);
var ImageCrop = function (_a) {
    var imgSrc = _a.imgSrc, imgName = _a.imgName, width = _a.width, height = _a.height, onClick = _a.onClick, onClose = _a.onClose;
    var wrapRef = useRef(null);
    var cropAreaRef = useRef(null);
    var _b = useState(ORIGIN_SIZE), imgSize = _b[0], setImgSize = _b[1];
    var _c = useState(ORIGIN_SIZE), cropBoxSize = _c[0], setCropBoxSize = _c[1];
    var _d = useState(ORIGIN_POINT), offset = _d[0], setOffset = _d[1];
    var _e = useState(1), widthRatio = _e[0], setWidthRatio = _e[1];
    var _f = useState(1), heightRatio = _f[0], setHeightRatio = _f[1];
    useEffect(function () {
        init();
    }, [imgSrc]);
    var getWidth = function (imgWidth, imgHeight) {
        if (imgWidth > width && imgHeight > height) {
            if (height > width)
                return width;
            else
                return Math.min(imgWidth * (height / imgHeight), width);
        }
        if (imgHeight > height)
            return Math.min(imgWidth, width) * (height / imgHeight);
        return Math.min(imgWidth, width);
    };
    var getHeight = function (imgWidth, imgHeight) {
        if (imgWidth > width && imgHeight > height) {
            if (height < width)
                return height;
            else
                return Math.min(imgHeight * (width / imgWidth), height);
        }
        if (imgWidth > width)
            return Math.min(imgHeight, height) * (width / imgWidth);
        return Math.min(imgHeight, height);
    };
    var init = function () {
        var imgEl = new Image();
        imgEl.src = imgSrc;
        imgEl.onload = function () {
            var imgWidth = getWidth(imgEl.width, imgEl.height);
            var imgHeight = getHeight(imgEl.width, imgEl.height);
            setWidthRatio(imgWidth / imgEl.width);
            setHeightRatio(imgHeight / imgEl.height);
            setImgSize({ w: imgWidth, h: imgHeight });
            setCropBoxSize({ w: imgWidth / 2, h: imgHeight / 2 });
            setOffset({ x: imgWidth / 4, y: imgHeight / 4 });
        };
    };
    var convertCanvasToFile = function (dataUrl) {
        var blobBin = atob(dataUrl.split(',')[1]); // base64 데이터 디코딩
        var array = [];
        for (var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        return new File([new Blob([new Uint8Array(array)], { type: 'image/png' })], imgName);
    };
    var handleSave = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var imgEl = new Image();
        canvas.width = cropBoxSize.w;
        canvas.height = cropBoxSize.h;
        imgEl.src = imgSrc;
        imgEl.crossOrigin = 'anonymous';
        imgEl.onload = function () {
            var oc = document.createElement('canvas');
            var octx = oc.getContext('2d');
            oc.width = imgEl.width * widthRatio;
            oc.height = imgEl.height * heightRatio;
            octx === null || octx === void 0 ? void 0 : octx.drawImage(imgEl, 0, 0, oc.width, oc.height);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(oc, offset.x, offset.y, cropBoxSize.w, cropBoxSize.h, 0, 0, cropBoxSize.w, cropBoxSize.h);
            var file = convertCanvasToFile(canvas.toDataURL());
            onClick(file);
            onClose();
        };
    };
    if (!imgSrc)
        return null;
    return (_jsxs("div", __assign({ className: cx('imageCropModal') }, { children: [_jsxs("div", __assign({ className: cx('titleArea') }, { children: [_jsx("strong", __assign({ className: cx('title') }, { children: "\uC0AC\uC9C4 \uC218\uC815" })), _jsxs("div", __assign({ className: cx('btnArea') }, { children: [_jsx("a", __assign({ className: cx('btn', 'close'), role: "button", onClick: onClose }, { children: "\uCDE8\uC18C" })), _jsx("a", __assign({ className: cx('btn', 'save'), role: "button", onClick: handleSave }, { children: "\uC800\uC7A5" }))] }))] })), _jsx("div", __assign({ className: cx('imageArea') }, { children: _jsx("div", __assign({ ref: wrapRef, className: cx('wrap'), style: {
                        width: "".concat(width, "px"),
                        height: "".concat(height, "px"),
                    } }, { children: _jsxs("div", __assign({ ref: cropAreaRef, className: cx('cropArea'), style: {
                            width: "".concat(imgSize.w, "px"),
                            height: "".concat(imgSize.h, "px"),
                        } }, { children: [_jsx("div", __assign({ className: cx('imgArea') }, { children: _jsx("div", __assign({ className: cx('imgBox') }, { children: _jsx("img", { className: cx('img'), src: imgSrc, style: {
                                            width: "".concat(imgSize.w, "px"),
                                            height: "".concat(imgSize.h, "px"),
                                        } }) })) })), _jsx(DimmedBox, { imgSize: imgSize, setOffset: setOffset, setCropBoxSize: setCropBoxSize }), _jsx(CropBox, { imgSrc: imgSrc, imgSize: imgSize, offset: offset, setOffset: setOffset, cropBoxSize: cropBoxSize, setCropBoxSize: setCropBoxSize })] })) })) }))] })));
};
export default ImageCrop;
