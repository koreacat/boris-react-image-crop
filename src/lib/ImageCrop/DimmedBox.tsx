import { Size, Point, clamp } from './data';
import styles from './imageCrop.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

interface DimmedBoxProps {
  imgRef: React.RefObject<HTMLImageElement>;
  imgSize: Size;
  setOffset: (offset: ((prev: Point) => Point) | Point) => void;
  setCropBoxSize: (cropBoxSize: Size) => void;
}

const DimmedBox = ({ imgRef, imgSize, setOffset, setCropBoxSize }: DimmedBoxProps) => {
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

  const startSetCropBox = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    // e.clientX, Y = 뷰포트 내에서의 클릭 지점
    const startPoint = { x: e.clientX, y: e.clientY };

    const initCropBox = () => {
      setOffset({
        x: startPoint.x - getOffsetLeft(),
        y: startPoint.y - getOffsetTop(),
      });
      setCropBoxSize({ w: 0, h: 0 });
    };

    const setCropBox = (e: MouseEvent) => {
      initCropBox();
      const w = e.clientX - startPoint.x;
      const h = e.clientY - startPoint.y;
      const x = startPoint.x - getOffsetLeft();
      const y = startPoint.y - getOffsetTop();
      const offsetX = (w < 0 ? e.clientX : startPoint.x) - getOffsetLeft();
      const offsetY = (h < 0 ? e.clientY : startPoint.y) - getOffsetTop();
      const maxCropBoxW = w < 0 ? x : imgSize.w - x;
      const maxCropBoxH = h < 0 ? y : imgSize.h - y;
      const cropBoxW = clamp(Math.abs(w), 0, maxCropBoxW);
      const cropBoxH = clamp(Math.abs(h), 0, maxCropBoxH);

      setOffset({ x: Math.max(offsetX, 0), y: Math.max(offsetY, 0) });
      setCropBoxSize({ w: cropBoxW, h: cropBoxH });
    };

    const stopSetCropBox = () => {
      document.removeEventListener('mousemove', setCropBox);
      document.removeEventListener('mouseup', stopSetCropBox);
    };

    document.addEventListener('mousemove', setCropBox);
    document.addEventListener('mouseup', stopSetCropBox);
  };

  return (
    <div
      className={cx('dimmedBox')}
      onMouseDown={startSetCropBox}
      style={{
        width: `${imgSize.w}px`,
        height: `${imgSize.h}px`,
      }}
    />
  );
};

export default DimmedBox;
