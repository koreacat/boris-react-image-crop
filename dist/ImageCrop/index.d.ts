/// <reference types="react" />
interface ImageCropProps {
    imgSrc: string;
    imgName: string;
    width: number;
    height: number;
    onClick: (file: File) => void;
    onClose: () => void;
}
declare const ImageCrop: ({ imgSrc, imgName, width, height, onClick, onClose }: ImageCropProps) => JSX.Element | null;
export default ImageCrop;
