<script setup lang="ts">

import {useStage} from '../store/stage'

const stage = useStage()
function add_el(e:MouseEvent){
    stage.mouse.down = false;
    if(!stage.mouse.curElType){
        return
    }
    stage.elements.push({
        type:stage.mouse.curElType,
        x:e.offsetX,
        y:e.offsetY,
    })

}
function mousedown(e:MouseEvent){
    stage.mouse.down = true;
    console.log(e.target)
}

function mousemove(){
    if(!stage.mouse.down){
        return
    }
}
</script>
<template>
    <div @mousemove="mousemove" @mouseup="add_el">
        <svg view-box="0 0 500 500" xmlns="http://www.w3.org/2000/svg" @mousedown="mousedown">
            <template v-for="el in stage.elements">
                <rect v-if="el.type=='rect'" :x="el.x" :y="el.y" width="30" height="30">
                    <animate attributeName="width" values="0;30;0" ketTimes="0;1s;2s" dur="2s" repeatCount="indefinite" />
                </rect>
                <circle v-else-if="el.type=='circle'" :cx="el.x" :cy="el.y" r="30"></circle>
            </template>

        </svg>
    </div>
</template>
<style scoped>
svg{
    border: dashed 1px gray;
}
</style>