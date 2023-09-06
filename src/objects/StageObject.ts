import { ElementObjectType, PathDrawItem } from "./ElementObject";
import { AnimateAttribute, EffctEnum, FilterObject, MultipleValueListObject, MultipleValueObject, SelectObject, StageObecjArray, TransformType, panelTitle } from "./ObjectUtils";
/**
 * 舞台组件
 */
export class StageObject {
    public id: string = '';
    public name: string = 'element';
    public dom: HTMLElement | undefined = undefined;
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
    public transform: any;
    public filters: FilterObject[] = [];
    public editPoints = false;
    constructor() {
        this.id = this.createID();
    }
    createID() {
        let str = '';
        for (let i = 0; i < 8; i++) {
            const r = Math.floor(Math.random() * 26) + 97;
            str += String.fromCharCode(r);
        }
        return str + '_' + Date.now() + '_' + Math.round(Math.random() * 10000);
    }
    /**获取指定属性 */
    getValue(key: string) {
        return Reflect.get(this, key);
    }
    closePath() {

    }
    pathToString() {
        return ''
    }
    /**
     * 添加动画
     * @param t 
     */
    addAnimate(t: EffctEnum) {
        let child: StageObject | null = null
        switch (t) {
            case EffctEnum.animate:
                child = new AnimateObject();
                child.name += this.children.length;
                child.parent = this;

                break
            case EffctEnum.animateTransform:
                child = new AnimateTransformObject();
                child.name += this.children.length;
                child.parent = this;
                break
        }
        if (child) {
            this.children.push(child);
        } else {
            throw Error('暂不支持，开发中...');
        }
    }
}
/**
 * SVG 组件
 */
export class SvgObject extends StageObject {
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
    public get viewBox(): string {
        return '0 0 ' + this.width + ' ' + this.height;
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
        const ar: any[] = [];
        const keys = this.keyTimes.split(';');
        let origin = 0
        if (this.parent) {
            switch (this.attributeName.value) {
                case 'x':
                    origin = this.parent.x;
                    break;
                case 'y':
                    origin = this.parent.y;
                    break;
            }
        }

        for (const k of keys) {
            const tk = Number(k) * 10;
            const val = this.timeLine.get(String(tk));
            if (val !== undefined) {
                if (origin != 0) {
                    ar.push(origin + Number(val));
                } else {
                    ar.push(val);
                }
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
    @panelTitle('变换类型')
    public transformType: SelectObject = new SelectObject('rotate', [
        {
            title: '旋转',
            value: 'rotate'
        },
        {
            title: '缩放',
            value: 'scale'
        },
        {
            title: '位移',
            value: 'translate'
        }
    ]);
    @panelTitle('起始状态')
    public from: MultipleValueObject = new MultipleValueObject(new TransformType(this.transformType.value).vals)
    @panelTitle('结束状态')
    public to: MultipleValueObject = new MultipleValueObject(new TransformType(this.transformType.value).vals)
    @panelTitle('循环次数')
    public repeatCount: number | string = 'indefinite';
    @panelTitle('持续时间/s')
    public duration: number = 5;
    constructor() {
        super();
        this.hasChildren = false;
        this.name = '变换动画';
    }
    get from_vals() {
        return this.transformType.vals;
    }
    get to_vals() {
        return this.transformType.vals;
    }
    public set new_transformType(t: string) {
        this.transformType.value = t;
        this.from.vals = new TransformType(t).vals;
        this.to.vals = new TransformType(t).vals;
    }

    get fromValue() {
        let s = ''
        if (this.transformType.value === 'rotate') {
            s = this.from.getVal('a') + ' ' + (this.from.getVal('x')) + ' ' + (this.from.getVal('y'));
        } else if (this.transformType.value === 'translate') {
            s = this.from.getVal('x') + ' ' + this.from.getVal('y');
        } else if (this.transformType.value === 'scale') {
            s = (this.from.getVal('x')) + ' ' + (this.from.getVal('y'));
        }
        return s
    }

    get toValue() {
        let s = ''
        if (this.transformType.value === 'rotate') {
            s = this.to.getVal('a') + ' ' + (this.to.getVal('x')) + ' ' + (this.to.getVal('y'));
        } else if (this.transformType.value === 'translate') {
            s = this.to.getVal('x') + ' ' + this.to.getVal('y');
        } else if (this.transformType.value === 'scale') {
            s = (this.to.getVal('x')) + ' ' + (this.to.getVal('y'));
        }
        return s
    }
}

export class MotionPath extends StageObject {
    public name = '动画路径';
    @panelTitle('动画路径')
    public href: string = '';
}

/**
 * 变换
 */
export class TransformObject extends MultipleValueListObject {
    public skew: MultipleValueObject = new MultipleValueObject([
        {
            title: 'x',
            type: 'number',
            val: 0
        },
        {
            title: 'y',
            type: 'number',
            val: 0
        }
    ]);
    public rotate = new MultipleValueObject([
        {
            title: 'a',
            type: 'number',
            val: 0
        },
        {
            title: 'x',
            type: 'number',
            val: 0
        },
        {
            title: 'y',
            type: 'number',
            val: 0
        }
    ]);
    public translate = new MultipleValueObject([
        {
            title: 'x',
            type: 'number',
            val: 0
        },
        {
            title: 'y',
            type: 'number',
            val: 0
        }
    ]);
    public scale = new MultipleValueObject([
        {
            title: 'x',
            type: 'number',
            val: 1
        },
        {
            title: 'y',
            type: 'number',
            val: 1
        }
    ]);
    public transformOrigin = new MultipleValueObject([
        {
            title: 'x',
            type: 'number',
            val: 0
        },
        {
            title: 'y',
            type: 'number',
            val: 0
        }
    ]);
    public name = '变换';
    public keys = [
        {
            title: '倾斜',
            key: 'skew'
        },
        {
            title: '旋转',
            key: 'rotate'
        },
        {
            title: '平移',
            key: 'translate'
        },
        {
            title: '缩放',
            key: 'scale'
        },
        {
            title: '基点',
            key: 'transformOrigin'
        }
    ];
    transformToString() {
        const s = `rotate(${this.rotate.getVal('a')},${this.rotate.getVal('x')},${this.rotate.getVal('y')}) 
        translate(${this.translate.getVal("x")},${this.translate.getVal("y")}) 
        scale(${this.scale.getVal("x")},${this.scale.getVal('y')}) 
        skewX(${this.skew.getVal("x")}) skewY(${this.skew.getVal("y")})`
        return s
    }

    get origin() {
        return `${this.transformOrigin.getVal('x') + this.parent?.x} ${this.transformOrigin.getVal('y') + this.parent?.y}`
    }
}

