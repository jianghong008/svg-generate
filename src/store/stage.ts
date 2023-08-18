import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
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
    effect: null | StageObject,
    elements:StageObject[],
}

export const useStage = defineStore('stage', () => {
    const RootTageObject = new SvgObject();
    const RootDom = ref<HTMLElement>()
    const elements = reactive(RootTageObject);
    const mouse = reactive({
        down: false,
        curElType: 0,
        elMouse: false,
        drawing: false,
        x: 0,
        y: 0,
        multiple:false,
        multipleRect:{
            x:0,
            y:0,
            w:0,
            h:0
        }
    })
    const currentObject = reactive<StageObjectType>({
        element: null,
        last: null,
        effect: null,
        elements:[],
    })
    const menus = reactive({
        show: false,
        x: 0,
        y: 0,
        arg: Object as any,
    })
    const chooseElement = (id?: string | StageObject) => {
        currentObject.elements = [];
        if (id && id instanceof StageObject) {
            currentObject.last = currentObject.element;
            currentObject.element = id;
            return
        }
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
    const chooseAllElement = ()=>{
        const rect = mouse.multipleRect;
        currentObject.elements = [];
        elements.children.forEach(el => {
            if (el.x>=rect.x&& el.y>rect.y && el.x<rect.x+rect.w&&el.y<rect.h+rect.y) {
                currentObject.elements.push(el);
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
    const removeElement = (id?: string | StageObject) => {
        if (id && id instanceof StageObject) {
            return
        }
        elements.children.forEach((el, i) => {
            if (el.id === currentObject.element?.id) {
                elements.children.splice(i, 1);
                chooseElement();
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
        obj.parent = elements;
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
        menus,
        RootDom,
        chooseElement,
        moveElement,
        endDraw,
        addElement,
        stopMoveElement,
        removeElement,
        chooseAllElement,
    }
})
