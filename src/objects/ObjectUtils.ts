import { StageObject } from "./StageObject";

export enum FillRule {
    NONZERO = 'nonzero',
    EVENODD = 'evenodd'
}
/**
 * 控制面板标注
 * @param title 
 * @returns 
 */
export function panelTitle(title: string) {
    return (target: StageObject, key: string) => {
        Reflect.defineProperty(target, '_' + key, {
            value: title
        });
    }
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

export class UseObjectValue {
    private _val = '';
    constructor(color: string) {
        this._val = color;
    }

    toString() {
        return this._val;
    }
}
export enum EffctEnum {
    animate, animateMotion, filter
}

export const EffctEnumObjects = [
    {
        title: '通用动画',
        key: EffctEnum.animate
    },
    {
        title: '路径动画',
        key: EffctEnum.animateMotion
    },
    {
        title: '滤镜',
        key: EffctEnum.filter
    }
]

export class StageObecjArray<T> extends Array<T>{
    static EffctObjects = EffctEnumObjects;
}

export class AnimateAttribute {
    private _val = 'x';
    constructor(val: string) {
        this._val = val;
    }

    toString() {
        return this._val;
    }

    public static GetAttributs(so?: StageObject|null) {
        if(!so){
            return []
        }
        const ar = Reflect.ownKeys(so);
        const temp: string[] = [];
        for (let k of ar) {
            if (typeof k === 'string' && typeof Reflect.get(so, k) !== 'function') {
                temp.push(k);
            }
        }
        return temp;
    }
}

export class TransformObject {
    public skewX = 0;
    public skewY = 0;
    public rotate = {
        a: 0,
        x: 0,
        y: 0
    }

    public translate = {
        x: 0,
        y: 0
    }
    public scale = {
        x: 1,
        y: 1,
    }

    transformToString() {
        const s = `rotate(${this.rotate.a},${this.rotate.x},${this.rotate.y}) 
        translate(${this.translate.x},${this.translate.y}) 
        scale(${this.scale.x},${this.scale.y}) 
        skewX(${this.skewX}) skewY(${this.skewY})`
        return s
    }
}