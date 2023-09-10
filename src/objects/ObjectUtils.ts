import { PathDrawItem, PathDrawMethod } from "./ElementObject";
import { StageObject, SvgObject } from "./StageObject";

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
export class Filters {
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
        return `grayscale(${val}%)`;
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
    animate, animateMotion, animateTransform,
}

export const EffctEnumObjects = [
    // {
    //     title: '路径动画',
    //     key: EffctEnum.animateMotion
    // },
    {
        title: '变换动画',
        key: EffctEnum.animateTransform
    },
    {
        title: '通用动画',
        key: EffctEnum.animate
    },
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

    public static GetAttributs(so:any) {
        if (!so) {
            return []
        }
        const ar = Reflect.ownKeys(so);
        const temp: string[] = [];
        for (let k of ar) {
            if (typeof k === 'string' && Reflect.get(so, '_' + k)) {
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

export class TransformType {
    private _val = 'rotate';
    constructor(val: string) {
        this._val = val;
    }
    get value() {
        return this._val;
    }
    get enums() {
        return [
            {
                title: "旋转",
                key: "rotate",
                args: [
                    {
                        type: 'number',
                        title: 'a',
                        val: 0
                    },
                    {
                        type: 'number',
                        title: 'x',
                        val: 0
                    },
                    {
                        type: 'number',
                        title: 'y',
                        val: 0
                    }
                ]
            },
            {
                title: "位移",
                key: "translate",
                args: [
                    {
                        type: 'number',
                        title: 'x',
                        val: 0
                    },
                    {
                        type: 'number',
                        title: 'y',
                        val: 0
                    }
                ]
            },
            {
                title: "缩放",
                key: "scale",
                args: [
                    {
                        type: 'number',
                        title: 'x',
                        val: 1
                    },
                    {
                        type: 'number',
                        title: 'y',
                        val: 1
                    }
                ]
            },
            {
                title: "倾斜",
                key: "skew",
                args: [
                    {
                        type: 'number',
                        title: 'x',
                        val: 0
                    },
                    {
                        type: 'number',
                        title: 'y',
                        val: 0
                    },
                ]
            }
        ]
    }
    get vals(): InputFormItem[] {
        for (const e of this.enums) {
            if (e.key === this._val) {
                return e.args as InputFormItem[];
            }
        }
        return [];
    }
}
/**
 * 多值对象
 */
export class MultipleValueObject {
    public parent: StageObject | null = null;
    public vals: InputFormItem[] = [];
    constructor(vals: InputFormItem[]) {
        this.vals = vals;
    }
    setVal(key: string, val: any) {
        for (const v of this.vals) {
            if (v.title === key) {
                v.val = val;
            }
        }
    }
    getVal(key: string) {

        for (const val of this.vals) {
            if (val.title === key) {
                return val.val
            }
        }
        return null
    }
}

/**
 * 多值对象组
 */
export class MultipleValueListObject {
    public parent: StageObject | null = null;
}

export class SelectObject {
    public type: SelectType = 'const'
    public value: string = '';
    public vals: SelectValueObject[] = [];
    constructor(val: string, vals: SelectValueObject[]) {
        this.value = val;
        this.vals = vals;
    }
    public getVals(ar: StageObject[] | null | undefined) {
        const vals = [];
        if (!ar) {
            return
        }
        for (const so of ar) {
            vals.push({
                title: so.name,
                value: so.id,
            })
        }
        return vals;
    }
}
/**
 * 清理dom
 */
export function clearInvalidAttrsForDom(dom: HTMLElement) {
    //去掉 data-v以及多余
    const attrs = dom.getAttributeNames();
    for (const attr of attrs) {
        const attrCont = dom.getAttribute(attr);
        if (/^data-.+/.test(attr) || !attrCont || attr === 'class') {
            dom.removeAttribute(attr)
        }
    }
    // defs
    const defs = dom.getElementsByTagName('defs')[0];

    if (defs && defs.children.length === 0) {
        dom.removeChild(defs)
    }
    // 注释
    dom.innerHTML = dom.innerHTML.replace(/<!--(.|\s)*?-->/, '');

    // 清除子对象
    for (const child of dom.children) {
        clearInvalidAttrsForDom(child as HTMLElement);
    }
}

/**
 * 导出
 * @param obj 
 * @returns 
 */
export function exportObeject(obj: SvgObject) {
    if (!obj.dom) {
        console.error('dom不存在')
        return
    }
    const dom = obj.dom.cloneNode(true) as HTMLElement;

    clearInvalidAttrsForDom(dom)

    const text = new XMLSerializer().serializeToString(dom);

    const blob = new Blob([text], {
        type: 'text/plain'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mysvg.svg';
    link.style.position = 'fixed';
    link.style.right = '-200%';
    link.style.scale = '0';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function copyObeject(obj: SvgObject) {
    if (!obj.dom) {
        console.error('dom不存在')
        return
    }
    const dom = obj.dom.cloneNode(true) as HTMLElement;

    clearInvalidAttrsForDom(dom);
    copyText(new XMLSerializer().serializeToString(dom));
}

export function copyText(text: string) {
    const dom = document.createElement('textarea');
    dom.style.position = 'fixed';
    dom.style.right = '-200%';
    dom.style.scale = '0';
    dom.value = text;
    document.body.appendChild(dom);
    dom.select();
    document.execCommand('copy');
    document.body.removeChild(dom);
}
