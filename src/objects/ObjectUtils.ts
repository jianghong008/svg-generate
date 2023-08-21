import { PathDrawItem, PathDrawMethod } from "./ElementObject";
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
/**
 * 引用对象
 */
export class UseObjectValue {
    private _val = '';
    constructor(val: string) {
        this._val = val;
    }
    public get value() {
        return this.toString();
    }
    toString() {
        return `#${this._val}`;
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
        title: '变换动画',
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
    get value() {
        return this._val;
    }
    toString() {
        return this._val;
    }

    public static GetAttributs(so?: StageObject | null) {
        if (!so) {
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

/**
 * 创建新的路径点
 * @param method 
 * @param points 
 * @returns 
 */
export const createPathDrawItem = (method: PathDrawMethod, points: PathPoint[]) => {
    const point: PathDrawItem = {
        method,
        point: points
    }
    return point
}

export const TransformEnums: InputFormGroup[] = [
    {
        title: "旋转",
        key: "rotate",
        args: [
            {
                type: 'number',
                title: 'x'
            },
            {
                type: 'number',
                title: 'y'
            }
        ]
    },
    {
        title: "位移",
        key: "translate",
        args: [
            {
                type: 'number',
                title: 'x'
            },
            {
                type: 'number',
                title: 'y'
            }
        ]
    },
    {
        title: "缩放",
        key: "scale",
        args: [
            {
                type: 'number',
                title: 'x'
            },
            {
                type: 'number',
                title: 'y'
            }
        ]
    },
    {
        title: "倾斜Y",
        key: "skewY",
        args: [
            {
                type: 'number',
                title: 'y'
            },
        ]
    },
    {
        title: "倾斜X",
        key: "skewX",
        args: [
            {
                type: 'number',
                title: 'x'
            },
        ]
    }
]

export class TransformType {
    private _val = '';
    constructor(val: string) {
        this._val = val;
    }
    get value() {
        return this._val;
    }
    get enums() {
        return TransformEnums
    }
    get vals(){
        for(const e of this.enums){
            if(e.key === this._val){
                return e.args;
            }
        }
        return [];
    }
}
/**
 * 多值对象
 */
export class MultipleValueObject {
    public vals: InputFormItem[] = [];
    constructor(vals: InputFormItem[]) {
        this.vals = vals;
    }
    private _val = '';
    get value() {
        return this._val;
    }
    set value(val: string) {
        this._val = val;
    }
}