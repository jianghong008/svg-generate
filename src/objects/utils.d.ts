
interface TransformTypeArg {
    value: string,
    args: number,
    type: string
}

type TransformTypeValue = 'rotate' | 'translate' | 'scale' | 'skewY' | 'skewX'

interface AnimateAttributeObjectItem {
    title: string,
    key: string
}

interface PathPoint {
    x: number,
    y: number
}

interface InputFormItem {
    type: 'number' | 'text' | 'color',
    title:string,
    val:any
}

/**输入框组 */
interface InputFormGroup {
    title: string,
    key: string,
    args: InputFormItem[],
}