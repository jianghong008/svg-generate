<script setup lang="ts">
import { ElementObjectType, GroupObject } from '@/objects/ElementObject';
import { useStage } from '../store/stage'

const stage = useStage()
const ElementTypes = [
    {
        name: '矩形',
        key: ElementObjectType.rect
    },
    {
        name: '多边形',
        key: ElementObjectType.polygon
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
function choose_type(key: ElementObjectType, arg?: string) {
    stage.mouse.curElType = key;
    if (arg !== undefined) {
        stage.mouse.arg = arg;
    }
}
function choose_el(id: string) {
    stage.chooseElement(id)
}

</script>
<template>
    <div class="contr left">
        <h3>基础</h3>
        <div class="list icons">
            <div class="icon-box" v-for="e in ElementTypes" @click="choose_type(e.key)"
                :class="{ 'type-active': e.key === stage.mouse.curElType }">
                <img v-if="e.key === ElementObjectType.rect" class="icon" src="../assets/left-icos/rect.svg" alt="rect"
                    :title="e.name">
                <img v-else-if="e.key === ElementObjectType.ellipse" class="icon" src="../assets/left-icos/ellipse.svg"
                    alt="ellipse" :title="e.name">
                <img v-else-if="e.key === ElementObjectType.path" class="icon" src="../assets/left-icos/path.svg" alt="path"
                    :title="e.name">
                <img v-else class="icon" src="../assets/left-icos/text.svg" alt="text" :title="e.name">
            </div>
        </div>
        <h3>扩展</h3>
        <div class="list">
            <div v-for="e in stage.elements.defs" :class="{ 'type-active': e.type === stage.mouse.curElType&&e.id===stage.mouse.arg }"
                v-show="(e instanceof GroupObject)">
                <span @click="choose_type(e.type, e.id)">{{ e.name }}</span>
                <img src="../assets/left-icos/del.svg" alt="del" @click="stage.removeDefs(e.id)">
            </div>
        </div>
        <h3>大纲</h3>
        <div class="list">
            <div @click="choose_el(stage.elements.id)"
                :class="{ 'el-active': stage.elements.id === stage.currentObject.element?.id }">
                <span>svg</span>
            </div>
            <div v-for="e in stage.elements.children" :class="{ 'el-active': e.id === stage.currentObject.element?.id }">
                <span @click="choose_el(e.id)">{{ e.name }}</span>
                <img src="../assets/left-icos/del.svg" alt="del" @click="stage.removeElement(e.id)">
            </div>
        </div>
    </div>
</template>
<style scoped>
.left {
    overflow-y: auto;
    background-color: #242424;
    border-radius: 0.3rem;
    padding: 1rem 0.5rem;
    text-align: left;
}
.left h3{
    color: #838383;
    font-size: 0.9rem;
}
.type-active {
    background-color: #069adf;
}

.el-active {
    background-color: #069adf;
}

.contr .list:not(.icons) {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
    align-items: stretch;
}

.icons {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 1rem 0;
    gap: 0.5rem;
    justify-content: flex-start;
}

.contr .list div {
    border-radius: 0.5rem;
    position: relative;
}

.contr .list div span {
    padding: 0.2rem 1rem;
    width: 5em;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
}

.contr .list div img:not(.icon) {
    width: 1rem;
    height: 1rem;
    display: none;
    position: absolute;
    margin-top: 0.5rem;
    right: 0;
}

.contr .list div:hover img:not(.icon) {
    display: inline-block;
}
.icon-box{
    width: 1.5rem;
    height: 1.5rem;
}
.icon-box:hover{
    background-color: #0074a6;
}
.icon {
    width: 100%;
    height: 100%;
}
</style>