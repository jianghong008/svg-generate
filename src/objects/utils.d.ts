
interface TransformTypeArg {
    value: string,
    args: number,
    type: string
}

type TransformTypeValue = 'rotate' | 'translate' | 'scale' | 'skewY' | 'skewX'

interface StageObject {
    id: string
    name: string
    x: number
    y: number
    createID: () => string
    closePath: () => void
    pathToString: () => string
}

interface AnimateAttributeObjectItem {
    title:string,
    key:string
}