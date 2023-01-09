/// <reference types="react" />
import { Size, Point } from './data';
interface DimmedBoxProps {
    imgSize: Size;
    setOffset: (offset: ((prev: Point) => Point) | Point) => void;
    setCropBoxSize: (cropBoxSize: Size) => void;
}
declare const DimmedBox: ({ imgSize, setOffset, setCropBoxSize }: DimmedBoxProps) => JSX.Element;
export default DimmedBox;
