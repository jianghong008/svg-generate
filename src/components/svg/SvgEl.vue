<script setup lang="ts">
import { PathObject } from '@/objects/ElementObject';
import { useStage } from '@/store/stage';
import SvgChild from './SvgChild.vue';
const stage = useStage()

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
</script>
<template>
    <svg :view-box="stage.elements.viewBox" :xmlns="stage.elements.xmlns" :data-id="stage.elements.id"
        :width="stage.elements.width" :height="stage.elements.height" @mousedown="mousedown">
        <SvgChild/>
    </svg>
</template>
<style scoped>
svg {
    border: dashed 1px gray;
}
</style>