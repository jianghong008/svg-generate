<script setup lang="ts">
import { useStage } from '@/store/stage';
import { AnimateObject } from '@/objects/StageObject'
import { ref } from 'vue';
const { currentObject } = useStage();
const MaxTime = 101;
const curVal = ref('');
const curIndex = ref(-1);
const hasValue = (t: number) => {
    const animate = currentObject.effect as AnimateObject
    if (!animate) {
        return {
            has: false,
            val: ''
        }
    }

    for (let val of animate.keyTimes) {

        if (t == Number(val)) {
            return {
                has: true,
                val: animate.values[animate.keyTimes.indexOf(val)]
            }
        }
    }
    return {
        has: false,
        val: ''
    }
}
const showInput = (t: number) => {
    const st = String((t - 1) / 10);
    const animate = currentObject.effect as AnimateObject;
    if(!animate){
        return
    }
    curIndex.value = t;
    if(animate.keyTimes.includes(st)){
        animate.keyTimes.forEach((val,index)=>{
            if(st==val){
                animate.keyTimes.splice(index,1);
                animate.values.splice(index,1);
                return
            }
        })
    }else{
        animate.keyTimes.push(st);
        animate.keyTimes = animate.keyTimes.sort();
    }
    
}
const setVal = () => {
    console.log(curVal.value)
}
</script>
<template>
    <div class="box">
        <div class="time-line-box" v-if="(currentObject.effect instanceof AnimateObject)">
            <template v-for="t in MaxTime" :key="t">
                <div class="main-time" :data-time="(t - 1) / 10" v-if="(t - 1) % 10 == 0 || (t - 1) == 0"
                    v-show="t - 1 <= 100" :class="{ 'has-val': hasValue((t - 1) / 10).has }"
                    :title="hasValue((t - 1) / 10).val" @click="showInput(t)">
                    <input v-show="curIndex == t" type="text" v-model="curVal" @change="setVal">
                </div>
                <div :data-time="(t - 1) / 10" v-else v-show="t - 1 <= 100"
                    :class="{ 'has-val': hasValue((t - 1) / 10).has }" :title="hasValue((t - 1) / 10).val"
                    @click="showInput(t)">
                    <input v-show="curIndex == t" type="text" v-model="curVal" @change="setVal">
                </div>
            </template>

        </div>
    </div>
</template>
<style scoped>
.time-line-box {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-end;
}

.time-line-box>div {
    display: block;
    width: 6px;
    height: 0.8rem;
    background-color: #afafaf;
    position: relative;
}

.time-line-box .main-time {
    height: 1.5rem;
}

.time-line-box .main-time::after {
    content: attr(data-time);
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    font-size: 1rem;
    line-height: 1rem;
    transform: translateY(100%) translateX(-25%);
}

.has-val::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    line-height: 1rem;
    display: block;
    background-color: #ff0057;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: translateY(-50%) translateX(-1px);
}

.time-line-box input{
    position: absolute;
    top: 0;
    left: 0;
}
</style>