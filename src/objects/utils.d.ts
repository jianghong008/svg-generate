/*
 * Project: svg-generate
 * File Created: Sunday, 2023-08-13 11:51:35
 * Author: jianghong (jianghong2020@qq.com)
 * -----
 * Last Modified: Sunday, 2023-08-13 11:51:35
 * Modified By: jianghong (jianghong2020@qq.com)
 */

declare enum FillRule{
    nonzero,evenodd
}
type FillRule = 'nonzero' | 'evenodd'
interface ElementObject {
    x: number,
    y: number,
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
    fillOpacity: number,
    filter: string,
    fillRule: FillRule,
}

/**
 * 矩形
 */
interface RectObject extends ElementObject {
    rx?: number,
    ry?: number,
    width: number,
    height: number
}