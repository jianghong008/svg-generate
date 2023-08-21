<script setup lang="ts">
import { useStage } from '@/store/stage';
import { ColorObject, StopObject, SvgColor } from '@/objects/Color'
import { computed, ref } from 'vue';
import { ColorPicker } from 'vue-accessible-color-picker'
import { StageObject } from '@/objects/StageObject';
const { currentObject } = useStage();
const colorBlock = ref<HTMLElement>()
const colorIndex = ref(-1)
const showColor = ref(false)
const curColor = computed(() => {
    if (currentObject.child instanceof SvgColor) {
        return currentObject.child.getValue('value');
    }
    const s = currentObject.child?.children[colorIndex.value];
    if (s) {
        return s.getValue('stopColor').value;
    } else {
        return '#000'
    }
})
function addColor(e: MouseEvent) {
    const rect = colorBlock.value?.getBoundingClientRect();
    if (!rect || !currentObject.child) {
        return
    }
    const val = Math.round(e.offsetX / rect.width * 100);
    const color = new StopObject();
    color.offset = val;
    color.stopColor = new SvgColor();
    currentObject.child.children.push(color);
    //排序
    const temp: number[] = [];
    const ar: StageObject[] = []
    currentObject.child.children.forEach(stop => {
        temp.push(stop.getValue('offset'));
        ar.push(stop);
    })
    currentObject.child.children = [];
    temp.sort();
    for (const t of temp) {
        for (const c of ar) {
            if (t === c.getValue('offset')) {
                currentObject.child.children.push(c);
                continue;
            }
        }
    }
}
function setColor(e: MouseEvent, index: number) {
    if (e.button === 0) {
        showColor.value = true
        colorIndex.value = index;
    } else if (e.button === 2) {
        //删除
        colorIndex.value = -1;
        currentObject.child?.children.splice(index, 1);

    }

}
function setColorVal(e: { cssColor: string }) {

    if (!e) {
        return
    }
    const val = e.cssColor;

    if (currentObject.child instanceof SvgColor) {
        Reflect.set(currentObject.child, 'value', val);
        return
    }
    const stop = currentObject.child?.children[colorIndex.value];

    if (!stop) {
        return
    }
    Reflect.set(stop, 'stopColor', new SvgColor(val));

}
</script>
<template>
    <div class="color" v-if="(currentObject.child instanceof ColorObject)">
        <div ref="colorBlock" class="color-block" @click.self="addColor">
            <span v-for="(s, i ) in currentObject.child.children" :key="i"
                :style="{ left: s.getValue('offset') + '%', backgroundColor: s.getValue('stopColor') }"
                @mousedown.stop="setColor($event, i)">
            </span>
        </div>
        <div class="simple-color">
            <span :style="{ backgroundColor: currentObject.child.getValue('value') }" @click="showColor = true"></span>
        </div>
        <div class="color-picker" v-show="showColor">
            <ColorPicker :color="curColor" @color-change="setColorVal" />
            <p>
                <span class="btn" @click="showColor = false">确定</span>
            </p>
        </div>
    </div>
</template>
<style scoped>
.color-block {
    position: relative;
    height: 1rem;
    border: solid 1px gray;
    overflow: hidden;
}

.color-block span {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 10%;
    height: 1rem;
    background: #000;
}

.color-picker {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.btn {
    cursor: pointer;
    user-select: none;
}

.simple-color {
    text-align: center;
}

.simple-color span {
    width: 2rem;
    height: 2rem;
    display: inline-block;
}
</style>