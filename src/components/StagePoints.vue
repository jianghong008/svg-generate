<script setup lang="ts">
import { PathDrawItem, PathDrawMethod, } from '@/objects/ElementObject'
import { useStage } from '../store/stage'
import { onMounted } from 'vue';

const { currentObject, menus } = useStage()
const data = {
    mouseDown: false,
    x: 0,
    y: 0,
    pointIndex: 0,
    contrIndex: -1,
    pointNo:0,
}

function mousedown(e: MouseEvent, index: number, contr = -1) {
    e.preventDefault();
    menus.arg = -1;
    if (e.button == 0) {
        data.mouseDown = true;
        data.x = e.x;
        data.y = e.y;
        data.pointIndex = index;
        data.contrIndex = contr
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

const getPoints = (p:PathDrawItem) => {
    if(p.method === PathDrawMethod.C){
        return p.point[1]
    }else{
        return p.point[0]
    }
}

const mouseupHandler = () => {
    data.mouseDown = false;
    const el = currentObject.element;
    if (!el || !el.path[data.pointIndex]) {
        return
    }
}


const mousemoveHandler = (e: MouseEvent) => {

    if (!data.mouseDown) {
        return
    }

    const el = currentObject.element;
    if (!el || !el.path[data.pointIndex]) {

        return
    }
    if (data.contrIndex >= 0) {
        el.path[data.pointIndex].point[data.contrIndex].x += e.movementX;
        el.path[data.pointIndex].point[data.contrIndex].y += e.movementY;
    } else {
        el.path[data.pointIndex].point[0].x += e.movementX;
        el.path[data.pointIndex].point[0].y += e.movementY;
    }

}

onMounted(() => {
    window.addEventListener('mouseup', mouseupHandler)
    window.addEventListener('mousemove', mousemoveHandler)
})

</script>
<template>
    <div class="points" v-if="currentObject.element?.editPoints === true && currentObject.element.path.length > 0"
        :style="{ left: currentObject.element?.x + 'px', top: currentObject.element?.y + 'px' }">
        <div class="points-contr">
            <div class="point" v-for="(p, i) in currentObject.element?.path" :key="i"
                :style="{ left: (getPoints(p).x - 4) + 'px', top: (getPoints(p).y - 4) + 'px', display: p.method === PathDrawMethod.Z ? 'none' : 'block' }"
                :draggable="false" @mousedown.self="mousedown($event, i)">
                <div class="control" v-show="p.method === PathDrawMethod.C && ii != 1" v-for="(c, ii) in p.point" :key="ii"
                    :draggable="false" @mousedown.stop="mousedown($event, i, ii)">
                    <span :style="{ left: (c.x - getPoints(p).x) + 'px', top: (c.y - getPoints(p).y) + 'px' }"></span>
                </div>
            </div>
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

.points-contr .point {
    position: absolute;
    left: 0;
    top: 0;
    width: 8px;
    height: 8px;
    display: block;
    border: solid 3px red;
    cursor: move;
}

.control{
    position: relative;
}

.control>span{
    position: absolute;
    width: 8px;
    height: 8px;
    display: block;
    border: solid 3px rgb(37, 95, 255);
    cursor: move;
}
</style>