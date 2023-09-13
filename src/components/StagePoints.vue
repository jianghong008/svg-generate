<script setup lang="ts">
import { PathDrawMethod, } from '@/objects/ElementObject'
import { useStage } from '../store/stage'

const { currentObject, menus } = useStage()
const data = {
    mouseDown: false,
    x: 0,
    y: 0,
    pointIndex: 0,
    pointNo:0,
}

function mousedown(e: MouseEvent, index: number, no: number) {
    e.preventDefault();
    menus.arg = -1;
    if (e.button == 0) {
        data.mouseDown = true;
        data.x = e.x;
        data.y = e.y;
        data.pointIndex = index;
        data.pointNo = no
    } else if (e.button == 2 && currentObject.element) {
        const el = currentObject.element;
        if (!el || !el.path[data.pointIndex]) {
            return
        }
        menus.show = true;
        const x = el.path[index].point[no].x
        const y = el.path[index].point[no].y
        menus.x = currentObject.element.x + x;
        menus.y = currentObject.element.y + y;
        menus.arg = index + '_' + no;
    }

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

    el.path[data.pointIndex].point[data.pointNo].x += e.movementX;
    el.path[data.pointIndex].point[data.pointNo].y += e.movementY;
}
</script>
<template>
    <div class="points" v-if="currentObject.element?.editPoints === true && currentObject.element.path.length > 0"
        :style="{ left: currentObject.element?.x + 'px', top: currentObject.element?.y + 'px' }">
        <div class="points-contr">
            <template v-for="(ps, i) in currentObject.element?.path">
                <span v-for="(p, ii) in ps.point" :key="ii"
                    :style="{ left: (p.x - 4) + 'px', top: (p.y - 4) + 'px', display: ps.method === PathDrawMethod.Z ? 'none' : 'block' }"
                    :draggable="false" @mousedown="mousedown($event, i, ii)"></span>
            </template>

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