import styles from './imageCrop.module.scss';
import classnames from 'classnames/bind';
import { useRef } from 'react';
import { Point, Size, ORIGIN_POINT, LINE_DIR, POINT_DIR, clamp } from './data';

const cx = classnames.bind(styles);

function diffPoints(p1: Point, p2: Point) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point, minX = 0, minY = 0, maxX = 0, maxY = 0) {
  const x = p1.x + p2.x;
  const y = p1.y + p2.y;
  return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
}

interface CropBoxProps {
  imgRef: React.RefObject<HTMLImageElement>;
  imgSrc: string;
  imgSize: Size;
  offset: Point;
  setOffset: (offset: ((prev: Point) => Point) | Point) => void;
  cropBoxSize: Size;
  setCropBoxSize: (cropBoxSize: Size) => void;
}

const CropBox = ({ imgRef, imgSrc, imgSize, offset, setOffset, cropBoxSize, setCropBoxSize }: CropBoxProps) => {
  const lastMousePosRef = useRef<Point>(ORIGIN_POINT);

  const getEdgeWidth = () => imgSize.w - cropBoxSize.w;
  const getEdgeHeight = () => imgSize.h - cropBoxSize.h;

  // 이미지의 좌상단 꼭지점
  const getOffsetTop = () => {
    const el = imgRef.current;
    const offset = el?.getBoundingClientRect().top || 0;
    return offset;
  };

  const getOffsetLeft = () => {
    const el = imgRef.current;
    const offset = el?.getBoundingClientRect().left || 0;
    return offset;
  };

  const startPan = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    document.addEventListener('mousemove', moveCropBox);
    document.addEventListener('mouseup', stopPan);

    // e.clientX, Y = 뷰포트 내에서의 클릭 지점
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const moveCropBox = (e: MouseEvent) => {
    const lastMousePos = lastMousePosRef.current;
    const currentMousePos = { x: e.clientX, y: e.clientY };
    const mouseDiff = diffPoints(currentMousePos, lastMousePos);

    lastMousePosRef.current = currentMousePos;
    setOffset((prevOffset) => addPoints(prevOffset, mouseDiff, 0, 0, getEdgeWidth(), getEdgeHeight()));
  };

  const stopPan = () => {
    document.removeEventListener('mousemove', moveCropBox);
    document.removeEventListener('mouseup', stopPan);
  };

  const startSetCropBox = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, dir: string) => {
    e.preventDefault();

    const eLineX = offset.x + cropBoxSize.w;
    const wLineX = offset.x;
    const sLineY = offset.y + cropBoxSize.h;
    const nLineY = offset.y;

    const setCropBox = (e: MouseEvent) => {
      const startPoint = { x: e.clientX, y: e.clientY };

      setBox({
        x: clamp(startPoint.x - getOffsetLeft(), 0, imgSize.w),
        y: clamp(startPoint.y - getOffsetTop(), 0, imgSize.h)
      });
    };

    const setBox = (currentMousePos: { x: number; y: number }) => {
      const isCrossEL = !(wLineX + cropBoxSize.w > currentMousePos.x);
      const isCrossWL = eLineX - cropBoxSize.w > currentMousePos.x;
      const isCrossSL = !(nLineY + cropBoxSize.h > currentMousePos.y);
      const isCrossNL = sLineY - cropBoxSize.h > currentMousePos.y;

      const eXOffset = eLineX - cropBoxSize.w - (offset.x - currentMousePos.x);
      const wXOffset = wLineX - (offset.x - currentMousePos.x);
      const sYOffset = sLineY - cropBoxSize.h - (offset.y - currentMousePos.y);
      const nYOffset = nLineY - (offset.y - currentMousePos.y);

      const eCrossW = eLineX - cropBoxSize.w - currentMousePos.x;
      const wCrossW = currentMousePos.x - wLineX - cropBoxSize.w;
      const sCrossH = sLineY - cropBoxSize.h - currentMousePos.y;
      const nCrossH = currentMousePos.y - nLineY - cropBoxSize.h;

      const eW = cropBoxSize.w + currentMousePos.x - eLineX;
      const wW = cropBoxSize.w + wLineX - currentMousePos.x;
      const sH = cropBoxSize.h + currentMousePos.y - sLineY;
      const nH = cropBoxSize.h + nLineY - currentMousePos.y;

      switch (dir) {
        case 'e':
          if (isCrossWL) {
            setOffset({ x: eXOffset, y: offset.y });
            setCropBoxSize({ w: eCrossW, h: cropBoxSize.h });
          } else {
            setCropBoxSize({ w: eW, h: cropBoxSize.h });
          }
          break;
        case 'w':
          if (isCrossEL) {
            setCropBoxSize({ w: wCrossW, h: cropBoxSize.h });
          } else {
            setOffset({ x: wXOffset, y: offset.y });
            setCropBoxSize({ w: wW, h: cropBoxSize.h });
          }
          break;
        case 's':
          if (isCrossNL) {
            setOffset({ x: offset.x, y: sYOffset });
            setCropBoxSize({ w: cropBoxSize.w, h: sCrossH });
          } else {
            setCropBoxSize({ w: cropBoxSize.w, h: sH });
          }
          break;
        case 'n':
          if (isCrossSL) {
            setCropBoxSize({ w: cropBoxSize.w, h: nCrossH });
          } else {
            setOffset({ x: offset.x, y: nYOffset });
            setCropBoxSize({ w: cropBoxSize.w, h: nH });
          }
          break;
        case 'se':
          if (isCrossNL && isCrossWL) {
            setOffset({ x: eXOffset, y: sYOffset });
            setCropBoxSize({ w: eCrossW, h: sCrossH });
          } else if (isCrossWL) {
            setOffset({ x: eXOffset, y: offset.y });
            setCropBoxSize({ w: eCrossW, h: sH });
          } else if (isCrossNL) {
            setOffset({ x: offset.x, y: sYOffset });
            setCropBoxSize({ w: eW, h: sCrossH });
          } else {
            setCropBoxSize({ w: eW, h: sH });
          }
          break;
        case 'sw':
          if (isCrossNL && isCrossEL) {
            setOffset({ x: offset.x + cropBoxSize.w, y: nYOffset });
            setCropBoxSize({ w: wCrossW, h: sCrossH });
          } else if (isCrossEL) {
            setCropBoxSize({ w: wCrossW, h: sH });
          } else if (isCrossNL) {
            setOffset({ x: wXOffset, y: nYOffset });
            setCropBoxSize({ w: wW, h: sCrossH });
          } else {
            setOffset({ x: wXOffset, y: offset.y });
            setCropBoxSize({ w: wW, h: sH });
          }
          break;
        case 'ne':
          if (isCrossSL && isCrossWL) {
            setOffset({ x: eXOffset, y: offset.y + cropBoxSize.h });
            setCropBoxSize({ w: eCrossW, h: nCrossH });
          } else if (isCrossWL) {
            setOffset({ x: eXOffset, y: nYOffset });
            setCropBoxSize({ w: eCrossW, h: nH });
          } else if (isCrossSL) {
            setCropBoxSize({ w: eW, h: nCrossH });
          } else {
            setOffset({ x: offset.x, y: nYOffset });
            setCropBoxSize({ w: eW, h: nH });
          }
          break;
        case 'nw':
          if (isCrossSL && isCrossEL) {
            setCropBoxSize({ w: wCrossW, h: nCrossH });
          } else if (isCrossEL) {
            setOffset({ x: offset.x + cropBoxSize.w, y: nYOffset });
            setCropBoxSize({ w: wCrossW, h: nH });
          } else if (isCrossSL) {
            setOffset({ x: wXOffset, y: offset.y + cropBoxSize.h });
            setCropBoxSize({ w: wW, h: nCrossH });
          } else {
            setOffset({ x: wXOffset, y: nYOffset });
            setCropBoxSize({ w: wW, h: nH });
          }
          break;
      }
    };

    const stopSetCropBox = () => {
      document.removeEventListener('mousemove', setCropBox);
      document.removeEventListener('mouseup', stopSetCropBox);
    };

    document.addEventListener('mousemove', setCropBox);
    document.addEventListener('mouseup', stopSetCropBox);
  };

  const getDash = () => ['w', 'h'].map((dir) => <span key={dir} className={cx('dash', dir)} />);

  const getLine = () =>
    LINE_DIR.map((dir: string) => (
      <span key={dir} className={cx('line', dir)} onMouseDown={(e) => startSetCropBox(e, dir)} />
    ));

  const getPoints = () =>
    POINT_DIR.map((dir: string) => (
      <span key={dir} className={cx('point', dir)} onMouseDown={(e) => startSetCropBox(e, dir)} />
    ));

  return (
    <div
      className={cx('cropBox')}
      style={{
        width: `${cropBoxSize.w}px`,
        height: `${cropBoxSize.h}px`,
        transform: `translateX(${offset.x}px) translateY(${offset.y}px)`,
      }}
    >
      {/* image */}
      <span className={cx('viewBox')}>
        <img
          className={cx('viewImg')}
          src={imgSrc}
          alt={'img'}
          style={{
            width: `${imgSize.w}px`,
            height: `${imgSize.h}px`,
            transform: `translateX(-${offset.x}px) translateY(-${offset.y}px)`,
          }}
        />
      </span>

      {/* dash */}
      {getDash()}

      {/* cross */}
      <span className={cx('cross')} />

      {/* cursor */}
      <span className={cx('moveBox')} onMouseDown={startPan} />

      {/* border*/}
      {getLine()}

      {/* points */}
      {getPoints()}
    </div>
  );
};

export default CropBox;
