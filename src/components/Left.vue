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
</script>
<template>
    <div class="contr">
        <h3>文档</h3>
        <div>
            <p v-for="e in ElementTypes" @click="choose_type(e.key)" :class="{'type-active':e.key===stage.mouse.curElType}">
                {{ e.name }}
            </p>
        </div>
        <div>
            <p>rect1</p>
        </div>
    </div>
</template>
<style scoped>
.type-active{
    font-weight: bold;
}
</style>