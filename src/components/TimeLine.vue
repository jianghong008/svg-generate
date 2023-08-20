<script setup lang="ts">
import { useStage } from '@/store/stage';
import { AnimateObject } from '@/objects/StageObject'
import { ref } from 'vue';
const { currentObject } = useStage();
const MaxTime = 101;
const curVal = ref('');
const curIndex = ref(-1);
const unit = '%';
const hasValue = (t: number) => {
    const animate = currentObject.child as AnimateObject
    if (!animate) {
        return {
            has: false,
            val: ''
        }
    }

    for (let [val] of animate.timeLine) {

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
const showInput = (e: MouseEvent, t: number) => {
    const st = String((t - 1) / 10);
    const animate = currentObject.child as AnimateObject;
    if (!animate) {
        return
    }
    const has = animate.timeLine.has(st);
    if (e.button === 0) {
        if (!has) {
            return
        }
        if (curIndex.value == t) {
            curIndex.value = -1;
            return
        }
        curIndex.value = t;
        const val = animate.timeLine.get(st);
        curVal.value = val !== undefined ? val : '';
        return
    } else if (e.button == 1) {
        return;
    }
    curIndex.value = -1;
    if (has) {
        animate.timeLine.delete(st);
    } else {
        animate.timeLine.set(st, '');
    }

}
const setVal = () => {
    const st = String((curIndex.value - 1) / 10);
    const animate = currentObject.child as AnimateObject;
    if (!animate) {
        return
    }
    animate.timeLine.set(st, curVal.value);
    curIndex.value = -1;
}

</script>
<template>
    <div class="box">
        <div class="time-line-box" v-if="(currentObject.child instanceof AnimateObject)">
            <template v-for="t in MaxTime" :key="t">
                <div class="main-time" :data-time="(t - 1) + unit" v-if="(t - 1) % 10 == 0 || (t - 1) == 0"
                    v-show="t - 1 <= 100"
                    :class="{ 'has-val': hasValue((t - 1) / 10).has, 'cur-val': curIndex == t && hasValue((t - 1) / 10).has }"
                    :title="hasValue((t - 1) / 10).val" @mousedown.self="showInput($event, t)">
                    <div class="input" v-show="curIndex == t">
                        <input type="text" v-model="curVal" placeholder="请输入当前值">
                        <span @click.stop="setVal">确定</span>
                    </div>
                </div>
                <div :data-time="t - 1" v-else v-show="t - 1 <= 100"
                    :class="{ 'has-val': hasValue((t - 1) / 10).has, 'cur-val': curIndex == t && hasValue((t - 1) / 10).has }"
                    :title="hasValue((t - 1) / 10).val" @mousedown.self="showInput($event, t)">
                    <div class="input" v-show="curIndex == t">
                        <input type="text" v-model="curVal" placeholder="请输入当前值">
                        <span @click.stop="setVal">确定</span>
                    </div>
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
    font-size: 0.9rem;
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

.time-line-box .input {
    display: none;
}

.time-line-box .has-val .input {
    position: absolute;
    top: -1rem;
    left: -3px;
    transform: translateY(-100%) translateX(-45%);

    display: inline-block;
    z-index: 100;

}

.time-line-box .has-val .input>input {
    width: 5rem;
    padding: 0.6em 0.8em;
    color: #607D8B;
    outline: #607D8B;
    border-color: #607D8B;
}

.time-line-box .cur-val::after {
    content: '';
    height: 0;
    width: 0;
    border-top: solid #607D8B 1rem;
    border-bottom: 0;
    border-left: solid transparent 3.6rem;
    border-right: solid transparent 3.6rem;
    transform: translateY(-100%) translateX(-45%);
    position: absolute;
    top: 0;
    left: -3px;
}

.time-line-box .cur-val span {
    width: 100%;
    display: block;
    cursor: pointer;
}

.time-line-box .cur-val span:hover {
    background-color: #cbcbcb;
}
</style>