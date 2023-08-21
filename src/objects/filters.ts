import { panelTitle } from "./ObjectUtils";
import { StageObject } from "./StageObject";

/**
 * 滤镜
 */
export class FilterObject extends StageObject {

}

/**
 * 模糊
 */
export class FeGaussianBlurObject extends FilterObject {
    @panelTitle('偏差')
    public stdDeviation: number = 1;
    public in = 'SourceGraphic';
}
