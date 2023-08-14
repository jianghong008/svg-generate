<script setup lang="ts">

import {
    ElementObjectType,
    PathObject,

} from '@/objects/ElementObject';
import { useStage } from '../store/stage'

const stage = useStage()
//添加元素
function add_el(e: MouseEvent) {
    if (stage.mouse.drawing) {
        return;
    }
    stage.mouse.down = false;

    stage.addElement(e.offsetX, e.offsetY);
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
    const id = (e.target as Element).getAttribute('data-id');

    id && stage.chooseElement(id);
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
        <svg :view-box="stage.elements.viewBox" :xmlns="stage.elements.xmlns" :data-id="stage.elements.id"
            :width="stage.elements.width" :height="stage.elements.height" @mousedown="mousedown">
            <template v-for="el in stage.elements.children">
                <rect :data-id="el.id" v-if="el.type == ElementObjectType.rect" :x="el.x" :y="el.y"
                    :width="el.getValue('width')" :height="el.getValue('height')"
                    :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                    :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                    :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"
                    :rx="el.getValue('rx')" :ry="el.getValue('ry')">
                </rect>
                <circle :data-id="el.id" v-else-if="el.type == ElementObjectType.circle" :cx="el.x" :cy="el.y"
                    :r="el.getValue('r')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                    :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                    :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"></circle>
                <ellipse :data-id="el.id" v-else-if="el.type == ElementObjectType.ellipse" :cx="el.x" :cy="el.y"
                    :rx="el.getValue('rx')" :ry="el.getValue('ry')"
                    :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                    :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                    :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"></ellipse>
                <path :data-id="el.id" v-else-if="el.type == ElementObjectType.path"
                    :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :x="el.x" :y="el.y"
                    :d="el.pathToString()" :stroke="el.getValue('stroke').toString()"
                    :stroke-width="el.getValue('strokeWidth')" :fill="el.getValue('fill').toString()"
                    :fill-opacity="el.getValue('fillOpacity')" />
                <text :data-id="el.id" v-else-if="el.type == ElementObjectType.text" :x="el.x" :y="el.y"
                    :font-size="el.getValue('fontSize')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                    :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                    :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')">
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