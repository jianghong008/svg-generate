<script setup lang="ts">
import { SvgObject } from '@/objects/StageObject';
import { PathDrawMethod } from '@/objects/ElementObject'
import { useStage } from '../store/stage'
import { computed } from 'vue';
const { currentObject } = useStage()
const data = {
    mouseDown: false,
    x: 0,
    y: 0,
    pointIndex: 0,
}
const canControle = computed(() => {
    if (currentObject.element && !(currentObject.element instanceof SvgObject)) {
        return true;
    } else {
        return false;
    }
})

function mousedown(e: MouseEvent, index: number) {
    e.preventDefault();
    data.mouseDown = true;
    data.x = e.x;
    data.y = e.y;
    data.pointIndex = index;
}
window.onmouseup = () => {
    data.mouseDown = false;
    const el = currentObject.element;
    if (!el || !el.path[data.pointIndex]) {
        return
    }
}
window.onmousemove = (e: MouseEvent) => {
    if (!data.mouseDown) {
        return
    }
    const el = currentObject.element;
    if (!el || !el.path[data.pointIndex]) {
        return
    }

    el.path[data.pointIndex].point[0].x += e.movementX;
    el.path[data.pointIndex].point[0].y += e.movementY;
}
</script>
<template>
    <div class="points" v-if="canControle"
        :style="{ left: currentObject.element?.x + 'px', top: currentObject.element?.y + 'px' }">
        <div class="points-contr">
            <span v-for="(p, i) in currentObject.element?.path" :key="i"
                :style="{ left: (p.point[0].x - 4) + 'px', top: (p.point[0].y - 4) + 'px', display: p.method === PathDrawMethod.Z ? 'none' : 'block' }"
                :draggable="false" @mousedown="mousedown($event, i)"></span>
        </div>
    </div>
</template>
<style scoped>
.points {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
}

.points-contr {
    position: relative;
}

.points-contr>span {
    position: absolute;
    left: 0;
    top: 0;
    width: 8px;
    height: 8px;
    display: block;
    border: solid 3px red;
    cursor: move;
}
</style>