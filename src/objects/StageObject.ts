import { ElementObjectType, PathDrawItem } from "./ElementObject";
import { AnimateAttribute, EffctEnum, StageObecjArray, panelTitle } from "./ObjectUtils";
export class TransformType {
    private _val = 'rotate';
    constructor(val?: TransformTypeValue) {
        if (!val || !this.ArgsCount) {
            throw Error('不存在变换类型:' + val);
        }
        this._val = val;
    }
    toString() {
        return this._val;
    }
    get ArgsCount(): TransformTypeArg {
        const en = this.getEnum();
        return Reflect.get(en, this._val);
    }
    getEnum() {
        return {
            rotate: {
                value: 'rotate',
                args: 2,
                type: 'number'
            },
            translate: {
                value: 'translate',
                args: 2,
                type: 'number'
            },
            scale: {
                value: 'scale',
                args: 2,
                type: 'number'
            },
            skewY: {
                value: 'scale',
                args: 1,
                type: 'number'
            },
            skewX: {
                value: 'skewX',
                args: 1,
                type: 'number'
            },
        }
    }
}
/**
 * 舞台组件
 */
export class StageObject {
    public id: string = '';
    public name: string = 'element';
    public initX = 0;
    public initY = 0;
    public x: number = 0;
    public y: number = 0;
    public type = ElementObjectType.svg;
    public children = new StageObecjArray<StageObject>;
    public hasChildren = true;
    public path: PathDrawItem[] = [];
    public closed: boolean = false;
    public parent: StageObject | null = null
    public transform:any;
    constructor() {
        this.id = this.createID();
    }
    createID() {
        let str = '';
        for (let i = 0; i < 8; i++) {
            const r = Math.round(Math.random() * 26) + 96;
            str += String.fromCharCode(r);
        }
        return str + '_' + Date.now() + '_' + Math.round(Math.random() * 10000);
    }

    getValue(key: string) {
        return Reflect.get(this, key);
    }
    closePath() {

    }
    pathToString() {
        return ''
    }
    addChild(t: EffctEnum) {
        switch (t) {
            case EffctEnum.animate:
                const child = new AnimateObject();
                child.name += this.children.length;
                child.parent = this;
                this.children.push(child);
                break
        }
    }
}
/**
 * SVG 组件
 */
export class SvgObject extends StageObject {
    @panelTitle('视图大小')
    public viewBox: string = '0 0 500 500';
    public xmlns: string = 'http://www.w3.org/2000/svg';
    @panelTitle('宽度')
    public width: number = 500;
    @panelTitle('高度')
    public height: number = 500;
    public defs: StageObject[] = [];
    constructor() {
        super();
        this.name = 'svg'
    }
}

/**
 * 预制 组件
 */
export class DefsObject extends StageObject {
    constructor() {
        super();
        this.name = '预制集';
    }
}
/**
 * 通用动画组件
 */
export class AnimateObject extends StageObject {
    @panelTitle('变换属性')
    public attributeName: AnimateAttribute = new AnimateAttribute('x');
    @panelTitle('变换次数')
    public repeatCount: number | string = 'indefinite';
    @panelTitle('时长/s')
    public duration: number = 1;

    public timeLine = new Map<string, string>();
    constructor() {
        super();
        this.hasChildren = false;
        this.name = '通用动画';
    }

    public get keyTimes() {
        let ar: number[] = [];
        for (const k of this.timeLine.keys()) {
            ar.push(Number(k));
        }

        for (let i = 0; i < ar.length; i++) {
            ar[i] = (ar[i]) / 10;
        }
        ar = ar.sort();
        return ar.join(';')
    }

    public get values() {
        const ar: string[] = [];
        const keys = this.keyTimes.split(';')
        for (const k of keys) {
            const tk = Number(k) * 10;
            const val = this.timeLine.get(String(tk));
            if (val !== undefined) {
                ar.push(val);
            }
        }
        return ar.join(';')
    }
}

export class AnimateMotionObject extends StageObject {
    constructor() {
        super();
        this.hasChildren = false;
        this.name = '路径动画';
    }
}

export class AnimateTransformObject extends StageObject {
    public attributeName: string = 'transform';
    public attributeType: string = 'XML';
    public transformType: TransformType = new TransformType();
    constructor() {
        super();
        this.hasChildren = false;
        this.name = '变换动画';
    }
}

export class MotionPath extends StageObject {
    public name = '动画路径';
    @panelTitle('动画路径')
    public href: string = ''
}
export class TransformOriginObject extends StageObject {
    public name = '变换原点';
    @panelTitle('x%')
    public x: number = 50;
    @panelTitle('y%')
    public y: number = 50;
    toString(): string {
        return this.x + '% ' + this.y+'%'
    }
}
export class TransformValueObject extends StageObject {
    @panelTitle('x')
    public x: number = 0;
    @panelTitle('y')
    public y: number = 0;
}
export class TransformSkew extends TransformValueObject {
    @panelTitle('角度x')
    public x: number = 0;
    @panelTitle('角度y')
    public y: number = 0;
    public name: string = '倾斜';
}
export class TransformRotate extends TransformValueObject {
    public name: string = '旋转';
    @panelTitle('角度')
    public a: number = 0;
}
export class TransformTranslate extends TransformValueObject {
    @panelTitle('偏移x')
    public x: number = 0;
    @panelTitle('偏移y')
    public y: number = 0;
    public name: string = '平移';
}
export class TransformScale extends TransformValueObject {
    @panelTitle('比例x')
    public x: number = 0;
    @panelTitle('比例y')
    public y: number = 0;
    public name: string = '缩放';
    constructor() {
        super()
        this.x = 1;
        this.y = 1;
    }
}
/**
 * 变换
 */
export class TransformObject extends StageObject {
    @panelTitle('角度')
    public skew: TransformSkew = new TransformSkew();
    public rotate = new TransformRotate();
    public translate = new TransformTranslate();
    public scale = new TransformScale();
    public transformOrigin = new TransformOriginObject;
    public name = '变换'
    transformToString() {
        const s = `rotate(${this.rotate.a},${this.rotate.x},${this.rotate.y}) 
        translate(${this.translate.x},${this.translate.y}) 
        scale(${this.scale.x},${this.scale.y}) 
        skewX(${this.skew.x}) skewY(${this.skew.y})`
        return s
    }
}