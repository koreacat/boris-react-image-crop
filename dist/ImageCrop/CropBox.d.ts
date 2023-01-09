/// <reference types="react" />
import { Point, Size } from './data';
interface CropBoxProps {
    imgSrc: string;
    imgSize: Size;
    offset: Point;
    setOffset: (offset: ((prev: Point) => Point) | Point) => void;
    cropBoxSize: Size;
    setCropBoxSize: (cropBoxSize: Size) => void;
}
declare const CropBox: ({ imgSrc, imgSize, offset, setOffset, cropBoxSize, setCropBoxSize }: CropBoxProps) => JSX.Element;
export default CropBox;
