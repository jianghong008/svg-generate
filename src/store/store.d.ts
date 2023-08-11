interface StageElement {
    type: string,
    x: number,
    y: number,
    id: string,
    fill?:string,
    stroke?:string,
    strokeWidth?:number,
    fillOpacity?:number,
}

type StageObject = {
    element: null | StageElement,
    last: null | StageElement,
}