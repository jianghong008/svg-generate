import { ElementObjectType } from "./ElementObject";
import { StageObecjArray, panelTitle } from "./ObjectUtils";
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
    public attributeName: string = '';
    @panelTitle('变换次数')
    public repeatCount: number = 1;
    @panelTitle('时长/s')
    public duration: number | string = 'indefinite';
    @panelTitle('取值组')
    public values: string = '';
    @panelTitle('时间点')
    public keyTimes: string = '';
    constructor() {
        super();
        this.hasChildren = false;
        this.name = '通用动画';
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