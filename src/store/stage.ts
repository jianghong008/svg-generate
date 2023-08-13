
import { ElementObject, ElementObjectType } from '@/objects/ElementObject';
import { defineStore } from 'pinia'
import { reactive } from 'vue';
type StageObject = {
    element: null | ElementObject,
    last: null | ElementObject,
}

export const useStage = defineStore('stage', () => {
    const elements = reactive<ElementObject[]>([]);
    const mouse = reactive({
        down: false,
        curElType: 0,
        elMouse: false,
        drawing: false,
        x: 0,
        y: 0,
    })
    const currentObject = reactive<StageObject>({
        element: null,
        last: null
    })
    const chooseElement = (id?: string) => {
        if (!id) {
            currentObject.last = currentObject.element;
            currentObject.element = null;
            return;
        }
        elements.forEach(el => {
            if (el.id === id) {
                currentObject.last = currentObject.element;
                currentObject.element = el;
                return;
            }
        })
    }
    const moveElement = (x: number, y: number) => {
        if (!currentObject.element) {
            return
        }
        elements.forEach(el => {
            if (el.id === currentObject.element?.id) {
                el.x = x - mouse.x + el.initX;
                el.y = y - mouse.y + el.initY;
                return;
            }
        })
    }
    const endDraw = () => {
        mouse.curElType = ElementObjectType.none;
        mouse.drawing = false;
        if (!currentObject.element) {
            return
        }
        elements.forEach(el => {
            if (el.id === currentObject.element?.id && el.type === ElementObjectType.path) {
                el.closePath();
                return;
            }
        })
    }
    const addElement = (el: ElementObject) => {
        let count = 0;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].type === el.type) {
                count++;
            }
        }
        el.name = el.name + count;
        elements.push(el);
    }
    return {
        elements,
        mouse,
        currentObject,
        chooseElement,
        moveElement,
        endDraw,
        addElement,
    }
})
