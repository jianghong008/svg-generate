<script setup lang="ts">

import { createID, createObject, useStage } from '../store/stage'

const stage = useStage()
function add_el(e: MouseEvent) {
    stage.mouse.down = false;
    if (!stage.mouse.curElType) {
        return
    }
    stage.elements.push(createObject({
        type: stage.mouse.curElType,
        x: e.offsetX,
        y: e.offsetY,
        id: createID()
    }))
    stage.mouse.curElType = '';
}
function mousedown(e: MouseEvent) {
    stage.mouse.down = true;
    if (!e.target) {
        return
    }
    const id = (e.target as Element).id;

    stage.chooseElement(id);
}

function mousemove(e:MouseEvent) {
    if (!stage.mouse.down) {
        return
    }
    stage.moveElement(e.offsetX,e.offsetY)
}
console.log()
</script>
<template>
    <div @mousemove="mousemove" @mouseup="add_el">
        <svg view-box="0 0 500 500" xmlns="http://www.w3.org/2000/svg" @mousedown="mousedown">
            <template v-for="el in stage.elements">
                <rect :id="el.id" 
                v-if="el.type == 'rect'" :x="el.x" :y="el.y" width="30" height="30"
                :class="{'el-active':el.id===stage.currentObject.element?.id}"
                :stroke="el.stroke"
                :stroke-width="el.strokeWidth"
                :fill="el.fill" 
                :fill-opacity="el.fillOpacity"
                >
                    <animate attributeName="width" values="0;30;0" ketTimes="0;1s;2s" dur="2s" repeatCount="indefinite" />
                </rect>
                <circle :id="el.id" 
                v-else-if="el.type == 'circle'" :cx="el.x" :cy="el.y" r="30"
                :class="{'el-active':el.id===stage.currentObject.element?.id}"
                :stroke="el.stroke"
                :stroke-width="el.strokeWidth"
                :fill="el.fill" 
                :fill-opacity="el.fillOpacity"
                ></circle>
            </template>

        </svg>
    </div>
</template>
<style scoped>
svg {
    border: dashed 1px gray;
}
.el-active{
    outline: dashed 1px #FF5722;
}
</style>