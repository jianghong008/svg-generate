import { StageObecjArray, panelTitle } from "./ObjectUtils";
import { StageObject } from "./StageObject";
export class SvgColor{
    private _color = '';
    constructor(color?:string){
        if(color){
            this._color = color;
        }       
    }
    
    toString(){
        return this._color;
    }
}
/**
 * 颜色对象
 */
export class  ColorObject extends StageObject {

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
    public stopOpacity:number =1;
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
}

export class linearGradient extends ColorObject {
    public name = '线性渐变';
}
