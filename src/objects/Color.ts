import { panelTitle } from "./ObjectUtils";
import { StageObject } from "./StageObject";
export const ColorList = [
    {
        title: '单色',
        key: 'color',
    }, {
        title: '线性',
        key: 'linear',
    }, {
        title: '径向',
        key: 'radial',
    }
]
/**
 * 颜色对象
 */
export class ColorObject extends StageObject {
    public colorType = 'color';
}
export class SvgColor extends ColorObject {
    private _color = '#000000';
    public colorType = 'color'
    constructor(color?: string) {
        super()
        if (color) {
            this._color = color;
        }
    }
    get value() {
        return this._color;
    }
    set value(val: string) {
        this._color = val;
    }
    toString() {
        return this._color;
    }
    get cssColor(){
        return this._color;
    }
}
/**
 * 填充图案
 */
export class PatternObject extends ColorObject {
    @panelTitle('视图大小')
    public viewBox: string = '0 0 500 500';
    @panelTitle('宽度')
    public width: number = 50;
    @panelTitle('高度')
    public height: number = 50;
    public name = '填充图案';
    get value() {
        return `url('#${this.id}')`;
    }
}
/**
 * 渐变颜色
 */
export class StopObject extends ColorObject {
    @panelTitle('偏移%')
    public offset: number = 0;
    @panelTitle('颜色')
    public stopColor: SvgColor = new SvgColor('');
    @panelTitle('透明度')
    public stopOpacity: number = 1;
}
/**
 * 径向渐变
 */
export class RadialGradient extends ColorObject {
    @panelTitle('终点X%')
    public cx: number = 50;
    @panelTitle('终点Y%')
    public cy: number = 50;
    @panelTitle('起点X%')
    public fx: number = 50;
    @panelTitle('起点Y%')
    public fy: number = 50;
    @panelTitle('半径')
    public fr: number = 50;
    public name = '径向渐变';

    public children: StopObject[] = [];
    public colorType = 'radial'

    get value() {
        return `url('#${this.id}')`;
    }
    get cssColor() {
        let s = ''
        for (const c of this.children) {
            const color = c as StopObject;
            if (s == '') {
                s += color.stopColor.value + ' ' + color.offset + '%';
            } else {
                s += ',' + color.stopColor.value + ' ' + color.offset + '%';
            }

        }
        return 'linear-gradient(to right,' + s + ')'
    }
}

export class LinearGradient extends ColorObject {
    public colorType = 'linear'
    public name = '线性渐变';
    public rotate: number = 0;
    public get gradientTransform() {
        return 'rotate(' + this.rotate + ')'
    }
    get value() {
        return `url('#${this.id}')`;
    }
    get cssColor() {
        let s = ''
        for (const c of this.children) {
            const color = c as StopObject;
            if (s == '') {
                s += color.stopColor.value + ' ' + color.offset + '%';
            } else {
                s += ',' + color.stopColor.value + ' ' + color.offset + '%';
            }

        }
        return 'linear-gradient(to right,' + s + ')'
    }
}
