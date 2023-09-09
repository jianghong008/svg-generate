<script setup lang="ts">
import StagePoints from './StagePoints.vue'
import SvgEl from './svg/SvgEl.vue'
import StageMenu from './StageMenu.vue';
import { useStage } from '../store/stage'
import { onMounted, onUnmounted } from 'vue';
import { deleteCurrentObject } from '@/objects/stagaeUtils';

const stage = useStage()
const multipleRect = stage.mouse.multipleRect
function box_mouseup() {
    if (stage.mouse.down) {
        stage.stopMoveElement();
        stage.mouse.down = false;
    }

    if (stage.mouse.multiple) {
        stage.mouse.multiple = false;
        stage.mouse.multipleRect.w = 0;
        stage.mouse.multipleRect.h = 0;
        if (stage.currentObject.elements.length > 0) {
            //菜单
            stage.menus.x = stage.mouse.x;
            stage.menus.y = stage.mouse.y;
            stage.menus.show = true;
        }

    }
}


function mousemove(e: MouseEvent) {
    if (stage.mouse.down) {
        //移动元素
        stage.moveElement(e.offsetX, e.offsetY);
        return
    }
    if (stage.mouse.multiple) {
        //多选
        multipleRect.w = e.offsetX - stage.mouse.x - 6;
        multipleRect.h = e.offsetY - stage.mouse.y - 6;

        stage.chooseAllElement();
    }
}
function onkeydown(e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
        case 'delete':
            deleteCurrentObject(stage.currentObject.element, stage.elements,stage.mouse.arg);
            stage.currentObject.element = null;
            stage.mouse.arg = null;
            stage.mouse.curElType = 0;
            break
    }
}
onMounted(() => {
    window.addEventListener('keydown', onkeydown);
})
onUnmounted(() => {
    window.removeEventListener('keydown', onkeydown);
})
</script>
<template>
    <div class="stage-warp" @mousemove="mousemove" @mouseup="box_mouseup">
        <div class="svg-box">
            <SvgEl />
            <StagePoints />
            <StageMenu />
            <div class="multiple-rect" v-show="stage.mouse.multiple"
                :style="{ left: multipleRect.x + 'px', top: multipleRect.y + 'px', width: multipleRect.w + 'px', height: multipleRect.h + 'px' }">
            </div>
        </div>
    </div>
</template>
<style scoped>
.stage-warp {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #242424;
    border-radius: 0.3rem;
    padding: 1rem 0.5rem;
    margin: 0 0.1rem;
    overflow: auto;
}

.svg-box {
    position: relative;
}

.multiple-rect {
    position: absolute;
    left: 0;
    top: 0;
    border: dashed 1px #ff3a3a;
}
</style>