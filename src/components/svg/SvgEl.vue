<script setup lang="ts">
import { ClipPathObject, PathObject } from '@/objects/ElementObject';
import { useStage } from '@/store/stage';
import SvgChild from './SvgChild.vue';

import { onMounted, ref } from 'vue';
import { StageObject } from '@/objects/StageObject';
import ClipPath from './ClipPath.vue';

const stage = useStage()
// svg按下
function mousedown(e: MouseEvent) {
    stage.mouse.x = e.offsetX;
    stage.mouse.y = e.offsetY;
    stage.menus.show = false;
    stage.mouse.multiple = false;
    const id = (e.target as Element).getAttribute('data-id');
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
    } else if (e.button == 2 && id != stage.elements.id) {
        //菜单
        stage.menus.arg = -1;
        stage.menus.show = true;
        stage.menus.x = e.offsetX;
        stage.menus.y = e.offsetY;
        
        
    }
    if (e.button == 0) {
        stage.mouse.down = true;
        stage.addElement(e.offsetX, e.offsetY);
    }

    if (!e.target || stage.mouse.drawing) {
        return
    }

    id && stage.chooseElement(id);

    if (id === stage.elements.id && e.button === 2) {
        //未选择文件则框选
        stage.mouse.multiple = true;
        stage.mouse.multipleRect.x = e.offsetX;
        stage.mouse.multipleRect.y = e.offsetY;
        stage.currentObject.elements = [];
    }
}
const svgDom = ref<HTMLElement>()
onMounted(() => {
    stage.RootDom = svgDom.value;
    stage.elements.dom = svgDom.value;
})
</script>
<template>
    <svg ref="svgDom" :view-box="stage.elements.viewBox" :xmlns="stage.elements.xmlns" :data-id="stage.elements.id"
        :width="stage.elements.width" :height="stage.elements.height" @mousedown="mousedown">
        <defs>
            <SvgChild :data="stage.elements.defs as StageObject[]"/>
        </defs>
        <ClipPath :data="stage.elements.clipPaths as ClipPathObject[]"/>
        <SvgChild :data="stage.elements.children as StageObject[]"/>
    </svg>
</template>
<style scoped>
svg {
    background-color: #fff;
}
</style>