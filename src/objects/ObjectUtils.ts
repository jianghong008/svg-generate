/*
 * Project: svg-generate
 * File Created: Sunday, 2023-08-13 11:47:59
 * Author: jianghong (jianghong2020@qq.com)
 * -----
 * Last Modified: Sunday, 2023-08-13 11:47:59
 * Modified By: jianghong (jianghong2020@qq.com)
 */
export enum FillRule{
    NONZERO='nonzero',
    EVENODD='evenodd'
}
/**
 * 滤镜
 */
export class FilterObject {
    static blur(val: number) {
        return `blur(${val}px)`;
    }
    static brightness(val: number) {
        return `brightness(${val})`;
    }
    static contrast(val: number) {
        return `contrast(${val})`;
    }
    static dropShadow(x: number, y: number, blur: number, color: string) {
        return `drop-shadow(${x}px ${y}px ${blur}px ${color})`;
    }
    static grayscale(val: number) {
        return `grayscale(${val})`;
    }
    /**
     * 色相旋转
     * @param val 
     * @returns 
     */
    static hueRotate(val: number) {
        return `hue-rotate(${val}deg)`;
    }
    /**
     * 反转
     * @param val 
     * @returns 
     */
    static invert(val: number) {
        return `invert(${val}%)`;
    }
    static opacity(val: number) {
        return `opacity(${val}%)`;
    }
    /**
     * 饱和度
     * @param val 
     * @returns 
     */
    static saturate(val: number) {
        return `saturate(${val}%)`;
    }
    static sepia(val: number) {
        return `sepia(${val}%)`;
    }
    static none() {
        return `none`;
    }
    /**
     * 继承
     * @returns 
     */
    static inherit() {
        return `inherit`;
    }
    static initial() {
        return `initial`;
    }
    static revert() {
        return `revert`;
    }
    static revertLayer() {
        return `revert-layer`;
    }
    static url(val: string) {
        return `url(${val})`;
    }
}