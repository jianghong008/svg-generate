<script setup lang="ts">
import { SvgColor } from '@/objects/Color';
import { useStage } from '@/store/stage';
import { computed } from 'vue';
import { StageObecjArray } from '@/objects/ObjectUtils'
const { currentObject } = useStage();
function setColor(key: string, input: EventTarget | null) {
    if (!input) {
        return
    }
    const val = (input as any).value;
    if (!currentObject.element) {
        return
    }
    Reflect.set(currentObject.element, key, new SvgColor(val))
}
function setValue(key: string, input: EventTarget | null, isString = false) {
    if (!input) {
        return
    }
    const val = isString ? ((input as any).value) : Number((input as any).value);
    if (!currentObject.element) {
        return
    }

    if ((input as any).type === 'checkbox') {
        Reflect.set(currentObject.element, key, (input as any).checked as boolean)
    } else {
        Reflect.set(currentObject.element, key, val)
    }
}
const propertys = computed(() => {
    if (!currentObject.element) {
        return []
    }
    return Reflect.ownKeys(currentObject.element)
})
const getValue = (key: string | symbol) => {
    if (!currentObject.element) {
        return null
    }
    return Reflect.get(currentObject.element, key)
}

const addEffect = (key: string) => {
    const input = window.document.getElementById(currentObject.element?.id + '_' + key);
    if (!input) {
        return
    }
    if (!currentObject.element) {
        return
    }
    const ar = currentObject.element.children;
    // Reflect.set(currentObject.element, key, ar);
    // console.log(input.value)
}
</script>
<template>
    <div class="right">
        <h3>属性</h3>
        <div class="right-plane" v-if="currentObject.element">
            <h3>{{ currentObject.element.name }}</h3>
            <div v-for="k in propertys" class="right-plane-item" :key="k">
                <template v-if="typeof k === 'string' && getValue('_' + k)">
                    <span>{{ getValue('_' + k) }}</span>
                    <input v-if="typeof getValue(k) === 'number'" type="number" @change="setValue(k, $event.target)"
                        :value="getValue(k)">
                    <input v-else-if="typeof getValue(k) === 'string'" type="text"
                        @change="setValue(k, $event.target, true)" :value="getValue(k)">
                    <input v-else-if="typeof getValue(k) === 'boolean'" type="checkbox"
                        @change="setValue(k, $event.target, true)" :checked="getValue(k)">
                    <input v-else-if="(getValue(k) instanceof SvgColor)" type="color" @change="setColor(k, $event.target)"
                        :value="getValue(k)">
                    <div v-else-if="(getValue(k) instanceof StageObecjArray)">
                        <details>
                            <summary>集合</summary>
                            <ul>
                                <li>动画1</li>
                                <li>动画2</li>
                            </ul>
                        </details>
                        <div>
                            <select :id="currentObject.element.id + '_' + k">
                                <option v-for="(e, ei) in StageObecjArray.EffctObjects" :key="ei" :value="e.key">
                                    {{ e.title }}
                                </option>
                            </select>
                            <button @click="addEffect(k)">添加</button>
                        </div>
                    </div>

                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
.right-plane-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0 1em;
}

.right-plane-item span {
    user-select: none;
}

.right-plane-item input:not(input[type='color']) {
    width: 5em;
}
</style>