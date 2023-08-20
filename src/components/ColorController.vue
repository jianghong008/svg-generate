<script setup lang="ts">
import { useStage } from '@/store/stage';
import { ColorObject, StopObject, SvgColor } from '@/objects/Color'
import { computed, ref } from 'vue';
const { currentObject } = useStage();
const colorBlock = ref<HTMLElement>()
const colorIndex = ref(-1)
const curColor = computed(()=>{
    const s = currentObject.child?.children[colorIndex.value];
    if(s){
        return s.getValue('stopColor');
    }else{
        return '#000000'
    }
})
function addColor(e: MouseEvent) {
    const rect = colorBlock.value?.getBoundingClientRect();
    if (!rect) {
        return
    }
    const val = Math.round(e.offsetX / rect.width * 100);
    const color = new StopObject();
    color.offset = val;
    color.stopColor = new SvgColor();
    currentObject.child?.children.push(color);
}
function setColor(e: MouseEvent, index: number) {
    if (e.button === 0) {
        colorIndex.value = index;
    } else if (e.button === 2) {
        //删除
        colorIndex.value = -1;
        currentObject.child?.children.splice(index,1);
        
    }
}
function setColorVal(input:EventTarget|null){
    if (!input) {
        return
    }
    const val = (input as any).value;
    
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
        <div>
             <input type="color"
                            @change="setColorVal($event.target)" :value="curColor">
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
</style>