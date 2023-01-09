/// <reference types="react" />
interface ImageCropProps {
    imgSrc?: string;
    imgName?: string;
    width?: number;
    height?: number;
    onClick: (file: File, url: string) => void;
}
declare const ImageCrop: ({ imgSrc, imgName, width, height, onClick }: ImageCropProps) => JSX.Element | null;
export default ImageCrop;
