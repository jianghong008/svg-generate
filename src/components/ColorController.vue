<script setup lang="ts">
import { useStage } from '@/store/stage';
import { ColorObject, StopObject, SvgColor } from '@/objects/Color'
import { computed, ref, reactive } from 'vue';
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
const mouse = reactive({
    down: false,
    move: false,
    x: 0,
    y: 0,
})
function setColor(e: MouseEvent, index: number) {
    if (e.button === 0) {
        colorIndex.value = index;
        mouse.down = true;
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
const picker = ref<HTMLDivElement>();
let clolorTimer: any = null
function pickColor(e: MouseEvent) {

    showColor.value = true;
    mouse.down = false;
    clearTimeout(clolorTimer);
    mouse.x = 0;
    clolorTimer = setTimeout(() => {
        if (!picker.value) {
            return
        }
        const rect = picker.value.getBoundingClientRect();
        if (rect.width + e.screenX > window.innerWidth/2) {
            mouse.x = window.innerWidth - rect.width / 2;
        } else if (e.screenX - rect.width / 2 < 0) {
            mouse.x = rect.width / 2;
        } else {
            mouse.x = e.screenX;
        }

        if (rect.height + e.screenY > window.innerHeight) {
            mouse.y = window.innerHeight - rect.height;
        } else {
            mouse.y = e.screenY;
        }
    }, 100)

}

</script>
<template>
    <div class="color" v-if="(currentObject.child instanceof ColorObject)">
        <div v-show="!(currentObject.child instanceof SvgColor)" ref="colorBlock" class="color-block"
            :style="{ background: currentObject.child.getValue('cssColor') }" @click.self="addColor" title="点击设置颜色">
            <span v-for="(s, i ) in currentObject.child.children" :key="i"
                :style="{ left: s.getValue('offset') + '%', backgroundColor: s.getValue('stopColor') }"
                @mousedown.stop="setColor($event, i)" @mouseup.stop="pickColor">
            </span>
        </div>
        <div v-show="(currentObject.child instanceof SvgColor)" class="simple-color">
            <span :style="{ backgroundColor: currentObject.child.getValue('value') }" @mousedown.stop="pickColor"></span>
        </div>
        <div ref="picker" class="color-picker" v-show="showColor"
            :style="{ left: mouse.x + 'px', top: mouse.y + 'px', opacity: mouse.x > 0 ? 1 : 0 }">
            <ColorPicker :color="curColor" @color-change="setColorVal" />
            <p class="btn" @click="showColor = false">
                确定
            </p>
        </div>
    </div>
</template>
<style scoped>
.color-block {
    position: relative;
    height: 1rem;
    border: solid 1px gray;
    cursor: pointer;
}

.color-block span {
    position: absolute;
    left: 0;
    top: 50%;
    display: block;
    width: 0.5rem;
    height: 1rem;
    background: #000;
    outline: solid 1px #fff;
    transform: translateX(-25%);
    
}

.color-picker {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background-color: #fff;
    box-shadow: 1px 1px 8px rgb(0 0 0 / 60%);
    color: #000;
}

.btn {
    cursor: pointer;
    user-select: none;
    color: #242424;
}

.simple-color {
    text-align: center;
}

.simple-color span {
    width: 2rem;
    height: 2rem;
    display: inline-block;
    outline: dashed 1px rgb(162, 162, 162);
}
</style>