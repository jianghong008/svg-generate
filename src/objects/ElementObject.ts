/*
 * Project: svg-generate
 * File Created: Sunday, 2023-08-13 13:46:41
 * Author: jianghong (jianghong2020@qq.com)
 * -----
 * Last Modified: Sunday, 2023-08-13 13:46:41
 * Modified By: jianghong (jianghong2020@qq.com)
 */

import { SvgColor } from "./Color";
import { FilterObject } from "./ObjectUtils";
export enum FillRule {
    NONZERO = 'nonzero',
    EVENODD = 'evenodd'
}
export enum ElementObjectType {
    none,
    rect,
    circle,
    path,
    ellipse,
    text,
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
    point: {
        x: number,
        y: number
    }[]
}
function panelTitle(title: string) {
    return (target: ElementObject, key: string) => {
        Reflect.defineProperty(target, '_' + key, {
            value:title
        });
    }
}
export class ElementObject {
    public id: string = '';
    public name: string = 'element';
    public type = ElementObjectType.none;
    public initX = 0;
    public initY = 0;
    @panelTitle('左边')
    public x: number = 0;
    @panelTitle('顶部')
    public y: number = 0;
    @panelTitle('画笔颜色')
    public stroke: SvgColor = new SvgColor('#000000');
    @panelTitle('画笔大小')
    public strokeWidth: number = 1;
    @panelTitle('填充')
    public fill: SvgColor = new SvgColor('#000000');
    @panelTitle('填充透明度')
    public fillOpacity: number = 1;
    public filter: string = FilterObject.none();
    public fillRule: FillRule = FillRule.NONZERO;
    public path: PathDrawItem[] = [];
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
    pathToString() {
        let s = ''
        for (let index = 0; index < this.path.length; index++) {
            const item = this.path[index];
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

        return s;
    }

    getValue(key: string) {
        return Reflect.get(this, key);
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
export class SvgObject extends ElementObject {

}
export class RectObject extends ElementObject {
    @panelTitle('宽度')
    public width = 0;
    @panelTitle('高度')
    public height = 0;
    @panelTitle('圆角X')
    public rx = 0;
    @panelTitle('圆角Y')
    public ry = 0;
    constructor(x: number, y: number, w: number, h: number) {
        super();
        this.x = x;
        this.y = y;
        this.initX = x;
        this.initY = y;
        this.width = w;
        this.height = h;
        this.type = ElementObjectType.rect;
        this.name = 'rect';
    }
}
export class CircleObject extends ElementObject {
    @panelTitle('半径')
    public r = 0;
    constructor(cx: number, cy: number, r: number) {
        super();
        this.x = cx;
        this.y = cy;
        this.initX = cx;
        this.initY = cy;
        this.r = r;
        this.type = ElementObjectType.circle;
        this.name = 'circle';
    }
}
export class EllipseObject extends ElementObject {
    @panelTitle('半径X')
    public rx = 0;
    @panelTitle('半径Y')
    public ry = 0;
    constructor(cx: number, cy: number, rx: number,ry:number) {
        super();
        this.x = cx;
        this.y = cy;
        this.initX = cx;
        this.initY = cy;
        this.rx = rx;
        this.ry = ry;
        this.type = ElementObjectType.ellipse;
        this.name = 'ellipse';
    }
}
export class TextObject extends ElementObject {
    @panelTitle('文本')
    public text = 'hello';
    @panelTitle('字体大小')
    public fontSize = 16;
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
            method: PathDrawMethod.Q,
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