<script setup lang="ts">
import {useStage} from '../store/stage'

const stage = useStage()
const ElementTypes = [
    {
        name:'矩形',
        key:'rect'
    },
    {
        name:'圆',
        key:'circle'
    },
    {
        name:'直线',
        key:'line'
    }
]
function choose_type(key:string){
    stage.mouse.curElType = key;
}
function choose_el(id:string){
    stage.chooseElement(id)
}
</script>
<template>
    <div class="contr">
        <h3>图形</h3>
        <div>
            <p v-for="e in ElementTypes" @click="choose_type(e.key)" :class="{'type-active':e.key===stage.mouse.curElType}">
                {{ e.name }}
            </p>
        </div>
        <h3>文档</h3>
        <div>
            <p v-for="e in stage.elements" @click="choose_el(e.id)" :class="{'el-active':e.id===stage.currentObject.element?.id}">
                {{ e.type }}
            </p>
        </div>
    </div>
</template>
<style scoped>
.type-active{
    font-weight: bold;
}
.el-active{
    outline: dashed 1px #FF5722;
}
</style>