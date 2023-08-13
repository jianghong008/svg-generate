<script setup lang="ts">

import {
    CircleObject,
    ElementObject,
    ElementObjectType,
    EllipseObject,
    PathObject,
    RectObject,
    TextObject
} from '@/objects/ElementObject';
import { useStage } from '../store/stage'

const stage = useStage()
//添加元素
function add_el(e: MouseEvent) {
    if (stage.mouse.drawing) {
        return;
    }
    stage.mouse.down = false;
    if (stage.mouse.curElType === ElementObjectType.none) {
        return
    }
    let obj: ElementObject | null = null;
    switch (stage.mouse.curElType) {
        case ElementObjectType.rect:
            obj = new RectObject(e.offsetX, e.offsetY, 100, 50);
            break;
        case ElementObjectType.circle:
            obj = new CircleObject(e.offsetX, e.offsetY, 30);
            break;
        case ElementObjectType.path:
            obj = new PathObject(e.offsetX, e.offsetY);
            stage.mouse.drawing = true;
            break;
        case ElementObjectType.ellipse:
            obj = new EllipseObject(e.offsetX, e.offsetY, 40, 20);
            break;
        case ElementObjectType.text:
            obj = new TextObject(e.offsetX, e.offsetY);
            break;
    }
    obj && stage.addElement(obj);
    obj && stage.chooseElement(obj.id);
    if (stage.mouse.curElType !== ElementObjectType.path) {
        stage.endDraw();
    }
}
function mousedown(e: MouseEvent) {
    e.preventDefault();
    stage.mouse.x = e.offsetX;
    stage.mouse.y = e.offsetY;
    if (stage.mouse.drawing && e.button == 0) {
        const obj = stage.currentObject.element as PathObject;
        if (!obj) {
            return
        }
        obj.lineTo(e.offsetX - obj.x, e.offsetY - obj.y);

        return
    } else if (stage.mouse.drawing && e.button == 2) {
        stage.endDraw();
        return
    }
    stage.mouse.down = true;
    if (!e.target) {
        return
    }
    const id = (e.target as Element).id;

    stage.chooseElement(id);
}

function mousemove(e: MouseEvent) {
    if (!stage.mouse.down) {
        return
    }

    stage.moveElement(e.offsetX, e.offsetY)
}
function stage_contextmenu(e: MouseEvent) {
    e.preventDefault();
}
</script>
<template>
    <div @mousemove="mousemove" @mouseup="add_el" @contextmenu="stage_contextmenu">
        <svg view-box="0 0 500 500" xmlns="http://www.w3.org/2000/svg" @mousedown="mousedown">
            <template v-for="el in stage.elements">
                <rect :id="el.id" v-if="el.type == ElementObjectType.rect" :x="el.x" :y="el.y" :width="el.getValue('width')"
                    :height="el.getValue('height')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                    :stroke="el.stroke.toString()" :stroke-width="el.strokeWidth" :fill="el.fill.toString()"
                    :fill-opacity="el.fillOpacity" :rx="el.getValue('rx')" :ry="el.getValue('ry')">
                </rect>
                <circle :id="el.id" v-else-if="el.type == ElementObjectType.circle" :cx="el.x" :cy="el.y"
                    :r="el.getValue('r')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                    :stroke="el.stroke.toString()" :stroke-width="el.strokeWidth" :fill="el.fill.toString()"
                    :fill-opacity="el.fillOpacity"></circle>
                <ellipse :id="el.id" v-else-if="el.type == ElementObjectType.ellipse" :cx="el.x" :cy="el.y"
                    :rx="el.getValue('rx')" :ry="el.getValue('ry')"
                    :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :stroke="el.stroke.toString()"
                    :stroke-width="el.strokeWidth" :fill="el.fill.toString()" :fill-opacity="el.fillOpacity"></ellipse>
                <path :id="el.id" v-else-if="el.type == ElementObjectType.path"
                    :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :x="el.x" :y="el.y"
                    :d="el.pathToString()" :stroke="el.stroke.toString()" :stroke-width="el.strokeWidth"
                    :fill="el.fill.toString()" :fill-opacity="el.fillOpacity" />
                <text :id="el.id" v-else-if="el.type == ElementObjectType.text"
                :x="el.x" :y="el.y"
                    :font-size="el.getValue('fontSize')"
                    :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :stroke="el.stroke.toString()"
                    :stroke-width="el.strokeWidth" :fill="el.fill.toString()" :fill-opacity="el.fillOpacity">
                    {{ el.getValue('text') }}
                </text>
            </template>

        </svg>
    </div>
</template>
<style scoped>
svg {
    border: dashed 1px gray;
}

.el-active {
    outline: dashed 1px #FF5722;
}
</style>