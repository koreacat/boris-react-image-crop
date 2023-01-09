export declare const ORIGIN_POINT: Readonly<{
    x: 0;
    y: 0;
}>;
export declare const ORIGIN_SIZE: Readonly<{
    w: 0;
    h: 0;
}>;
export declare const LINE_DIR: string[];
export declare const POINT_DIR: string[];
export interface Size {
    w: number;
    h: number;
}
export interface Point {
    x: number;
    y: number;
}
export declare function clamp(num: number, min: number, max: number): number;
