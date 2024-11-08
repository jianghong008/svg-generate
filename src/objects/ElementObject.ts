/*
 * Project: svg-generate
 * File Created: Sunday, 2023-08-13 13:46:41
 * Author: jianghong (jianghong2020@qq.com)
 * -----
 * Last Modified: Sunday, 2023-08-13 13:46:41
 * Modified By: jianghong (jianghong2020@qq.com)
 */

import { ColorObject, SvgColor } from "./Color";
import {  SelectObject, StageObecjArray, UseObjectValue, panelTitle, } from "./ObjectUtils";
import { StageObject, TransformObject,FilterMultipleValueObject } from "./StageObject";
export enum FillRule {
    NONZERO = 'nonzero',
    EVENODD = 'evenodd'
}
export enum ElementObjectType {
    none,
    rect,
    path,
    ellipse,
    text,
    svg,
    use,
    group,
    link,
    linearGradient,
    radialGradient,
    filter,
    polygon,
    clipPath
}
export enum PathDrawMethod {
    M = 'M',
    L = 'L',
    Z = 'Z',
    Q = 'Q',
    C = 'C',
}
export interface PathDrawItem {
    method: PathDrawMethod,
    point: PathPoint[]
}

/**
 * 元素组件
 */
export class ElementObject extends StageObject {
    @panelTitle('名称')
    public name: string = '对象0';
    public initX = 0;
    public initY = 0;
    @panelTitle('左边')
    public x: number = 0;
    @panelTitle('顶部')
    public y: number = 0;
    @panelTitle('画笔颜色')
    public stroke: ColorObject = new SvgColor();
    @panelTitle('画笔大小')
    public strokeWidth: number = 1;
    @panelTitle('填充')
    public fill: ColorObject = new SvgColor('rgba(0,0,0,0)');
    @panelTitle('填充度')
    public fillOpacity: number = 1;
    public fillRule: FillRule = FillRule.NONZERO;
    public path: PathDrawItem[] = [];
    @panelTitle('滤镜')
    public filters = new FilterMultipleValueObject();
    @panelTitle('变换')
    public transform: TransformObject = new TransformObject();
    @panelTitle('剪切')
    public clipPath: SelectObject = new SelectObject('', []);
    public set new_clipPath(t: string) {
        this.clipPath.value = t;
    }
    constructor() {
        super();
        this.clipPath.type = 'refs';
        this.transform.parent = this;
    }
    get pathString(){
        return this.pathToString();
    }
    pathToString(path: PathDrawItem[] = []) {
        let s = '';
        const ar = path.length > 0 ? path : this.path;
        for (let index = 0; index < ar.length; index++) {
            const item = ar[index];
            if (item.method === PathDrawMethod.Z) {
                s += item.method;
            } else {
                let p = '';
                for (let a = 0; a < item.point.length; a++) {
                    const point = item.point[a];
                    if (p) {
                        p += ',' + (point.x + this.x) + ' ' + (point.y + this.y)
                    } else {
                        p += (point.x + this.x) + ' ' + (point.y + this.y)
                    }
                }
                s += item.method + p;
            }

        }

        return s + (this.closed ? ' Z' : '');
    }

    closePath() {
        if (this.type !== ElementObjectType.path) {
            return
        }
        this.path.push({
            method: PathDrawMethod.Z,
            point: [{
                x: 0,
                y: 0
            }]
        })
    }
}

export class RectObject extends ElementObject {
    @panelTitle('宽度')
    public width = 100;
    @panelTitle('高度')
    public height = 60;
    @panelTitle('圆角X')
    public rx = 0;
    @panelTitle('圆角Y')
    public ry = 0;
    @panelTitle('动画')
    public children = new StageObecjArray<StageObject>;
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.initX = x;
        this.initY = y;
        this.type = ElementObjectType.rect;
        this.name = '矩形';
    }
}
export class EllipseObject extends ElementObject {
    @panelTitle('半径X')
    public rx = 40;
    @panelTitle('半径Y')
    public ry = 30;
    @panelTitle('动画')
    public children = new StageObecjArray<StageObject>;
    constructor(cx: number, cy: number) {
        super();
        this.x = cx;
        this.y = cy;
        this.initX = cx;
        this.initY = cy;
        this.type = ElementObjectType.ellipse;
        this.name = '椭圆';
    }
}
export class TextObject extends ElementObject {
    @panelTitle('文本内容')
    public text = 'hello';
    @panelTitle('字体大小')
    public fontSize = 16;
    @panelTitle('文本字体')
    public fontFamily: string = 'inherit';
    @panelTitle('动画')
    public children = new StageObecjArray<StageObject>;
    public textLength: string = 'None';
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.initX = x;
        this.initY = y;
        this.type = ElementObjectType.text;
        this.name = 'text';
    }
}
export class PathObject extends ElementObject {
    @panelTitle('闭合路径')
    public closed: boolean = false;
    @panelTitle('动画')
    public children = new StageObecjArray<StageObject>;
    public editPoints: boolean = true;
    constructor(startX: number, startY: number) {
        super();
        this.x = startX;
        this.y = startY;
        this.initX = startX;
        this.initY = startY;
        this.type = ElementObjectType.path;
        this.name = 'path';
        this.moveTo(0, 0);
    }
    moveTo(x: number, y: number) {
        this.path.push({
            method: PathDrawMethod.M,
            point: [{
                x,
                y
            }]
        })
    }
    lineTo(x: number, y: number) {
        this.path.push({
            method: PathDrawMethod.L,
            point: [{
                x,
                y
            }]
        })
    }
    closePath() {
        this.path.push({
            method: PathDrawMethod.Z,
            point: [{
                x: 0,
                y: 0
            }]
        })
    }
    /**
     * 两次曲线
     * @param contrX 
     * @param contrY 
     * @param endX 
     * @param endY 
     */
    quadraticCurveTo(contrX: number, contrY: number, endX: number, endY: number) {
        this.path.push({
            method: PathDrawMethod.Q,
            point: [{
                x: contrX,
                y: contrY
            },
            {
                x: endX,
                y: endY
            }]
        })
    }
    /**
     * 三次曲线
     * @param contrX1 
     * @param contrY1 
     * @param contrX2 
     * @param contrY2 
     * @param endX 
     * @param endY 
     */
    cubicCurveTo(contrX1: number, contrY1: number, contrX2: number, contrY2: number, endX: number, endY: number) {
        this.path.push({
            method: PathDrawMethod.C,
            point: [{
                x: contrX1,
                y: contrY1
            },
            {
                x: contrX2,
                y: contrY2
            }, {
                x: endX,
                y: endY
            }]
        })
    }
}
/**
 * 多边形
 */
export class PolygonObject extends PathObject {
    public name: string = '多边形';
    @panelTitle('边数')
    public sideCount: number = 3;
    @panelTitle('边长')
    public side: number = 80;
    public closed: boolean = true;
    public editPoints: boolean = false;
    get pathString() {
        if (this.sideCount < 3) {
            this.sideCount = 3;
        }
        const a = 360 / this.sideCount / 180 * Math.PI;
        const d = 360 / this.sideCount;
        const r = Math.sin(a) * (this.side / 2);
        const points: PathDrawItem[] = [];
        for (let i = 0; i < 360; i += d) {
            const ia = i / 180 * Math.PI;
            const x = Math.cos(ia) * r;
            const y = Math.sin(ia) * r;
            let m = i == 0 ? PathDrawMethod.M : PathDrawMethod.L;
            points.push({
                method: m,
                point: [{x,y}]
            })
        }
        return super.pathToString(points);
    }
}

/**
 * 组合器
 */
export class GroupObject extends ElementObject {
    @panelTitle('动画')
    public children = new StageObecjArray<StageObject>;
    constructor() {
        super();
        this.name = 'group';
        this.type = ElementObjectType.group;
    }
}

/**
 * 引用器
 */
export class UseObject extends ElementObject {
    @panelTitle('引用')
    public href: UseObjectValue = new UseObjectValue('');
    @panelTitle('宽度')
    public width = 100;
    @panelTitle('高度')
    public height = 60;
    @panelTitle('动画')
    public children = new StageObecjArray<StageObject>;
    constructor(x: number, y: number, href?: UseObjectValue) {
        super();
        this.x = x;
        this.y = y;
        this.initX = x;
        this.initY = y;
        this.name = 'group';
        this.type = ElementObjectType.use;
        if (href !== undefined) {
            this.href = href;
        }
    }
}

export class LinkObject extends ElementObject {
    public name = '超链接';
    @panelTitle('链接')
    public href: string = '';
    public type: ElementObjectType = ElementObjectType.link;
}

export class ClipPathObject extends ElementObject {
    public name = '剪切';
    public clipPathUnits: ClipPathObjectclipPathUnits = 'userSpaceOnUse';
    public type: ElementObjectType = ElementObjectType.clipPath;
}