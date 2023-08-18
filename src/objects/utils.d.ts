
interface TransformTypeArg {
    value: string,
    args: number,
    type: string
}

type TransformTypeValue = 'rotate' | 'translate' | 'scale' | 'skewY' | 'skewX'

interface AnimateAttributeObjectItem {
    title:string,
    key:string
}

interface PathPoint {
    x: number,
    y: number
}