import { defineStore } from 'pinia'
import { reactive } from 'vue';
export const createID = () => {
    return Date.now() + '' + Math.round(Math.random() * 10000)
}
export const createObject = (el: StageElement) => {
    if (el.strokeWidth === undefined) {
        el.strokeWidth = 1;
    }
    if (el.fillOpacity === undefined) {
        el.fillOpacity = 1;
    }

    if (el.fill === undefined) {
        el.fill = '#000000';
    }

    if (el.stroke === undefined) {
        el.stroke = '#000000';
    }

    return el;
}
export const useStage = defineStore('stage', () => {
    const elements = reactive<StageElement[]>([]);
    const mouse = reactive({
        down: false,
        curElType: '',
        elMouse: false,
    })
    const currentObject = reactive<StageObject>({
        element: null,
        last: null
    })
    const chooseElement = (id?: string) => {
        if(!id){
            currentObject.last = currentObject.element;
            currentObject.element = null;
        }
        elements.forEach(el => {
            if (el.id === id) {
                currentObject.last = currentObject.element;
                currentObject.element = el;
            }
        })
    }
    const moveElement = ( x: number, y: number) => {
        if(!currentObject.element){
            return
        }
        elements.forEach(el => {
            if (el.id === currentObject.element?.id) {
                el.x = x;
                el.y = y;
            }
        })
    }
    return {
        elements,
        mouse,
        currentObject,
        chooseElement,
        moveElement,
    }
})
