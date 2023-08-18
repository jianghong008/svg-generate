/*
 * Project: svg-generate
 * File Created: Sunday, 2023-08-13 19:17:01
 * Author: jianghong (jianghong2020@qq.com)
 * -----
 * Last Modified: Sunday, 2023-08-13 19:17:02
 * Modified By: jianghong (jianghong2020@qq.com)
 */
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
