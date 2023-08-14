<script setup lang="ts">
import { ElementObjectType } from '@/objects/ElementObject';
import { useStage } from '../store/stage'

const stage = useStage()
const ElementTypes = [
    {
        name: '矩形',
        key: ElementObjectType.rect
    },
    {
        name: '圆',
        key: ElementObjectType.circle
    },
    {
        name: '椭圆',
        key: ElementObjectType.ellipse
    },
    {
        name: '路径',
        key: ElementObjectType.path
    },
    {
        name: '文本',
        key: ElementObjectType.text
    },

]
function choose_type(key: ElementObjectType) {
    stage.mouse.curElType = key;
}
function choose_el(id: string) {
    stage.chooseElement(id)
}
</script>
<template>
    <div class="contr">
        <h3>图形</h3>
        <div class="list">
            <span v-for="e in ElementTypes" @click="choose_type(e.key)"
                :class="{ 'type-active': e.key === stage.mouse.curElType }">
                {{ e.name }}
            </span>
        </div>
        <h3>文档</h3>
        <div class="list">
            <span @click="choose_el(stage.elements.id)"
                :class="{ 'el-active': stage.elements.id === stage.currentObject.element?.id }">svg</span>
            <span v-for="e in stage.elements.children" @click="choose_el(e.id)"
                :class="{ 'el-active': e.id === stage.currentObject.element?.id }">
                {{ e.name }}
            </span>
        </div>
    </div>
</template>
<style scoped>
.type-active {
    font-weight: bold;
}

.el-active {
    outline: dashed 1px #FF5722;
}

.contr .list {
    display: flex;
    flex-direction: column;
    align-items: center;
}</style>