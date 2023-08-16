import { defineStore } from 'pinia'
import { reactive } from 'vue';
import {
    CircleObject,
    ElementObject,
    ElementObjectType,
    EllipseObject,
    PathObject,
    RectObject,
    TextObject
} from '@/objects/ElementObject';
import { StageObject, SvgObject } from '@/objects/StageObject';
type StageObjectType = {
    element: null | StageObject,
    last: null | StageObject,
    effect: null | StageObject
}

export const useStage = defineStore('stage', () => {
    const RootTageObject = new SvgObject()
    const elements = reactive(RootTageObject);
    const mouse = reactive({
        down: false,
        curElType: 0,
        elMouse: false,
        drawing: false,
        x: 0,
        y: 0,
    })
    const currentObject = reactive<StageObjectType>({
        element: null,
        last: null,
        effect: null,
    })
    const chooseElement = (id?: string) => {
        currentObject.effect = null;
        if (!id) {
            currentObject.last = currentObject.element;
            currentObject.element = null;
            return;
        }
        if (id === elements.id) {
            currentObject.last = currentObject.element;
            currentObject.element = elements;

            return
        }
        elements.children.forEach(el => {
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
        elements.children.forEach(el => {
            if (el.id === currentObject.element?.id) {
                el.x = x - mouse.x + el.initX;
                el.y = y - mouse.y + el.initY;
                return;
            }
        })
    }
    const stopMoveElement = () => {
        if (!currentObject.element) {
            return
        }
        elements.children.forEach(el => {
            if (el.id === currentObject.element?.id) {
                el.initX = el.x;
                el.initY = el.y;
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
    }
    const addElement = (x: number, y: number) => {
        if (mouse.curElType === ElementObjectType.none) {
            return
        }
        let obj: ElementObject | null = null;
        switch (mouse.curElType) {
            case ElementObjectType.rect:
                obj = new RectObject(x, y);
                break;
            case ElementObjectType.circle:
                obj = new CircleObject(x, y);
                break;
            case ElementObjectType.path:
                obj = new PathObject(x, y);
                mouse.drawing = true;
                break;
            case ElementObjectType.ellipse:
                obj = new EllipseObject(x, y);
                break;
            case ElementObjectType.text:
                obj = new TextObject(x, y);
                break;
        }
        if (!obj) {
            return
        }

        let count = 0;
        for (let i = 0; i < elements.children.length; i++) {
            if (elements.children[i].type === obj.type) {
                count++;
            }
        }

        obj.name = obj.name + count;
        elements.children.push(obj);
        if (mouse.curElType !== ElementObjectType.path) {
            endDraw();
        }
        //选择此元素
        if (mouse.drawing) {
            chooseElement(obj.id);
        }

    }
    return {
        elements,
        mouse,
        currentObject,
        chooseElement,
        moveElement,
        endDraw,
        addElement,
        stopMoveElement,
    }
})
