<script setup lang="ts">
import StagePoints from './StagePoints.vue'
import {
    ElementObjectType,
    PathObject,

} from '@/objects/ElementObject';
import { useStage } from '../store/stage'

const stage = useStage()

function box_mouseup() {
    if (stage.mouse.down) {
        stage.stopMoveElement();
        stage.mouse.down = false;
    }

}
function mousedown(e: MouseEvent) {
    stage.mouse.x = e.offsetX;
    stage.mouse.y = e.offsetY;

    if (stage.mouse.drawing && e.button == 0) {
        const obj = stage.currentObject.element as PathObject;
        if (!obj) {
            return
        }
        // obj.lineTo(e.offsetX - obj.x, e.offsetY - obj.y);
        const x = e.offsetX - obj.x;
        const y = e.offsetY - obj.y;
        obj.quadraticCurveTo(x - 8, y - 8, x, y)
        return
    } else if (stage.mouse.drawing && e.button == 2) {
        stage.endDraw();
        return
    }
    stage.mouse.down = true;

    stage.addElement(e.offsetX, e.offsetY);

    if (!e.target || stage.mouse.drawing) {
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
    <div class="stage-warp" @mousemove="mousemove" @mouseup="box_mouseup" @contextmenu="stage_contextmenu">
        <div class="svg-box">
            <svg :view-box="stage.elements.viewBox" :xmlns="stage.elements.xmlns" :data-id="stage.elements.id"
                :width="stage.elements.width" :height="stage.elements.height" @mousedown="mousedown">
                <template v-for="el in stage.elements.children">
                    <rect :data-id="el.id" v-if="el.type == ElementObjectType.rect" :x="el.x" :y="el.y"
                        :width="el.getValue('width')" :height="el.getValue('height')"
                        :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                        :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                        :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"
                        :transform="el.transform.transformToString()" :rx="el.getValue('rx')" :ry="el.getValue('ry')">
                    </rect>
                    <circle :data-id="el.id" v-else-if="el.type == ElementObjectType.circle" :cx="el.x" :cy="el.y"
                        :r="el.getValue('r')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                        :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                        :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"
                        :transform="el.transform.transformToString()"></circle>
                    <ellipse :data-id="el.id" v-else-if="el.type == ElementObjectType.ellipse" :cx="el.x" :cy="el.y"
                        :rx="el.getValue('rx')" :ry="el.getValue('ry')"
                        :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                        :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                        :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"
                        :transform="el.transform.transformToString()"></ellipse>
                    <path :data-id="el.id" v-else-if="el.type == ElementObjectType.path"
                        :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :x="el.x" :y="el.y"
                        :d="el.pathToString()" :stroke="el.getValue('stroke').toString()"
                        :stroke-width="el.getValue('strokeWidth')" :fill="el.getValue('fill').toString()"
                        :transform="el.transform.transformToString()" :fill-opacity="el.getValue('fillOpacity')" />
                    <text :data-id="el.id" v-else-if="el.type == ElementObjectType.text" :x="el.x" :y="el.y"
                        :font-size="el.getValue('fontSize')"
                        :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
                        :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
                        :transform="el.transform.transformToString()" :fill="el.getValue('fill').toString()"
                        :fill-opacity="el.getValue('fillOpacity')">
                        {{ el.getValue('text') }}
                    </text>
                </template>
            </svg>
            <StagePoints />
        </div>
    </div>
</template>
<style scoped>
.stage-warp {
    display: flex;
    justify-content: center;
    align-items: center;
}

svg {
    border: dashed 1px gray;
}

.el-active {
    outline: dashed 1px #FF5722;
}

.svg-box {
    position: relative;
}
</style>