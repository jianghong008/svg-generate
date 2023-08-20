import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import {
    ElementObject,
    ElementObjectType,
    EllipseObject,
    GroupObject,
    PathObject,
    RectObject,
    TextObject,
    UseObject
} from '@/objects/ElementObject';
import { StageObject, SvgObject } from '@/objects/StageObject';
import { UseObjectValue } from '@/objects/ObjectUtils';
type StageObjectType = {
    element: null | StageObject,
    last: null | StageObject,
    effect: null | StageObject,
    elements: StageObject[],
    child:null | StageObject,
}

export const useStage = defineStore('stage', () => {
    const RootTageObject = new SvgObject();
    const RootDom = ref<HTMLElement>()
    const elements = reactive(RootTageObject);
    const mouse = reactive({
        down: false,
        curElType: 0,
        arg: Object as any,
        drawing: false,
        x: 0,
        y: 0,
        multiple: false,
        multipleRect: {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    })
    /**
     * 当前选择
     */
    const currentObject = reactive<StageObjectType>({
        element: null,
        last: null,
        effect: null,
        elements: [],
        child:null,
    })
    const menus = reactive({
        show: false,
        x: 0,
        y: 0,
        arg: Object as any,
    })
    const chooseElement = (id?: string | StageObject) => {
        currentObject.elements = [];
        currentObject.child = null;
        mouse.arg = null;
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

    const chooseChild = (el:StageObject)=>{
        currentObject.child = el;
    }
    const chooseAllElement = () => {
        const rect = mouse.multipleRect;
        currentObject.elements = [];
        elements.children.forEach(el => {
            if (el.x >= rect.x && el.y > rect.y && el.x < rect.x + rect.w && el.y < rect.h + rect.y && el.type !== ElementObjectType.group) {
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
    //停止移动元素
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
        if (!id) {
            return
        }

        elements.children.forEach((el, i) => {
            if (el.id === id || el === id) {
                elements.children.splice(i, 1);
                chooseElement();

                return;
            }
        })
    }
    const removeDefs = (id?: string | StageObject) => {
        if (!id) {
            return
        }

        elements.defs.forEach((el, i) => {
            if (el.id === id || el === id) {
                elements.defs.splice(i, 1);
                return;
            }
        })
    }
    //结束绘制
    const endDraw = () => {
        mouse.curElType = ElementObjectType.none;
        mouse.drawing = false;
        if (!currentObject.element) {
            return
        }
    }
    //添加元素
    const addElement = (x: number, y: number) => {
        if (mouse.curElType === ElementObjectType.none) {
            return
        }
        let obj: ElementObject | null = null;
        switch (mouse.curElType) {
            case ElementObjectType.rect:
                obj = new RectObject(x, y);
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
            case ElementObjectType.group:
                obj = new UseObject(0, 0, new UseObjectValue(mouse.arg));
                mouse.arg = null;
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
    //打组对象
    const groupObjects = () => {

        if (currentObject.elements.length < 2) {
            return
        }
        const group = new GroupObject();
        group.name += elements.defs.length;
        currentObject.elements.forEach((el) => {
            group.children.push(el);
            //删除舞台元素
            removeElement(el);
        })
        currentObject.elements = [];
        //转存
        elements.defs.push(group);
        //引用
        const use = new UseObject(0, 0);
        use.href = new UseObjectValue(group.id);
        elements.children.push(use);
    }
    //解组
    const ungroupObject = (id?: string) => {

        if (!id) {
            return
        }
        let gid = '';
        //从舞台删除
        elements.children.forEach((el, index) => {
            if (el.id === id) {
                gid = el.getValue('href').value;
                gid && elements.children.splice(index, 1);
                return
            }
        })
        if (!gid) {
            return
        }
        //从组中取出
        elements.defs.forEach((el, index) => {
            if (el.id === gid) {
                el.children.forEach(gc => {
                    elements.children.push(gc);
                })
                //删除引用
                elements.defs.splice(index, 1);
                return
            }
        })
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
        groupObjects,
        ungroupObject,
        removeDefs,
        chooseChild,
    }
})
