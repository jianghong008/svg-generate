<script setup lang="ts">
import { SvgColor } from '@/objects/Color';
import { useStage } from '@/store/stage';
import { computed } from 'vue';
import { ColorObject, ColorList, RadialGradient, LinearGradient } from '@/objects/Color'
import {
    EffctEnum, StageObecjArray,
    AnimateAttribute, MultipleValueObject,
    MultipleValueListObject, SelectObject
} from '@/objects/ObjectUtils'
import { ElementObject } from '@/objects/ElementObject'
import { StageObject } from '@/objects/StageObject';
import InputGroup from './form/InputGroup.vue'

const { currentObject, chooseElement, chooseChild, addColorGradient, mouse } = useStage();

function setValue(key: string, input: EventTarget | null, isString = false) {
    if (!input) {
        return
    }
    const val = isString ? ((input as any).value) : Number((input as any).value);
    if (!currentObject.element) {
        return
    }
    if (Reflect.get(currentObject.element, key) instanceof SelectObject) {
        Reflect.set(currentObject.element, 'new_' + key, val)
        return
    }
    if ((input as any).type === 'checkbox') {
        Reflect.set(currentObject.element, key, (input as any).checked as boolean)
    } else {
        const old = Reflect.get(currentObject.element, key)
        if (typeof old === 'object' && old !== undefined && old !== null) {
            setObjectVal(key, val);
        } else {
            Reflect.set(currentObject.element, key, val);
        }
    }
}
// 特殊类型
function setObjectVal(key: string, val: string) {
    if (!currentObject.element) {
        return
    }
    const old = Reflect.get(currentObject.element, key);
    if (old === undefined || old === null) {
        return
    }
    if (old instanceof AnimateAttribute) {
        //动画属性
        Reflect.set(currentObject.element, key, new AnimateAttribute(val));
    }

}
const propertys = computed(() => {
    if (!currentObject.element) {
        return []
    }
    const keys = Reflect.ownKeys(currentObject.element);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === 'id' || typeof keys[i] !== 'string') {
            keys.splice(i, 1);
        }
    }
    return keys
})
const getValue = (key: string | symbol) => {
    if (!currentObject.element) {
        return null
    }
    return Reflect.get(currentObject.element, key)
}

const addEffect = (key: string) => {
    const input = window.document.getElementById(currentObject.element?.id + '_' + key) as HTMLInputElement;
    if (!input) {
        return
    }
    if (!currentObject.element) {
        return
    }

    currentObject.element.addAnimate(Number(input.value) as EffctEnum)
}
const chooseEffect = (s?: StageObject) => {
    if (!s) {
        return
    }

    chooseElement(s);
    chooseChild(s);
}

const addColorObject = (key: string, color: string) => {
    if (!currentObject.element) {
        return
    }
    const obj = Reflect.get(currentObject.element, key);
    if (obj['colorType'] === color) {
        currentObject.child = obj;
        return;
    }
    let newObj = null;
    if (color === 'color') {
        newObj = new SvgColor();
    } else if (color === 'linear') {
        newObj = new LinearGradient();
    } else if (color === 'radial') {
        newObj = new RadialGradient();
    }
    if (newObj) {
        Reflect.set(currentObject.element, key, newObj);
        currentObject.child = newObj;
        addColorGradient(newObj);
    }

}

const chooseColorObject = (color: ColorObject) => {
    currentObject.child = color;
}
</script>
<template>
    <div class="right">
        <template v-if="!mouse.arg">
            <h3>属性</h3>
            <div class="right-plane" v-if="currentObject.element">
                <div class="right-plane-item">
                    <span>名称</span>
                    <span>
                        {{ currentObject.element.name }}
                    </span>
                </div>
                <div v-for="k in propertys" class="right-plane-item" :key="k">
                    <template v-if="typeof k === 'string' && getValue('_' + k)">
                        <span>{{ getValue('_' + k) }}</span>
                        <input v-if="typeof getValue(k) === 'number'" type="number" @change="setValue(k, $event.target)"
                            :value="getValue(k)">
                        <input v-else-if="typeof getValue(k) === 'string'" type="text"
                            @change="setValue(k, $event.target, true)" :value="getValue(k)">
                        <input v-else-if="typeof getValue(k) === 'boolean'" type="checkbox"
                            @change="setValue(k, $event.target, true)" :checked="getValue(k)">

                        <!-- 动画 -->
                        <div class="input-panel" v-else-if="(getValue(k) instanceof StageObecjArray)">
                            <details>
                                <summary></summary>
                                <ul>
                                    <li v-for="a in currentObject.element.children" :key="a.id"
                                        v-show="!(a instanceof ElementObject)" @click="chooseEffect(a)">
                                        {{ a.name }}
                                    </li>
                                </ul>
                                <div>
                                    <select :id="currentObject.element.id + '_' + k">
                                        <option v-for="e in StageObecjArray.EffctObjects" :key="e.key" :value="e.key">
                                            {{ e.title }}
                                        </option>
                                    </select>
                                    <span @click="addEffect(k)">添加</span>
                                </div>
                            </details>

                        </div>
                        <!-- 动画属性 -->
                        <select v-else-if="(getValue(k) instanceof AnimateAttribute)" :value="getValue(k).value"
                            @change="setValue(k, $event.target, true)">
                            <option v-for="e in AnimateAttribute.GetAttributs(currentObject.element?.parent)" :key="e"
                                :value="e">
                                {{ e }}
                            </option>
                        </select>
                        <!-- 下拉选项 -->
                        <select v-else-if="(getValue(k) instanceof SelectObject)" :value="getValue(k).value"
                            @change="setValue(k, $event.target, true)">
                            <option v-for="e in getValue(k).vals" :key="e.value" :selected="getValue(k).value == e.value"
                                :value="e.value">
                                {{ e.title }}
                            </option>
                        </select>
                        <!-- 多值组 -->
                        <div class="input-panel" v-else-if="(getValue(k) instanceof MultipleValueListObject)">
                            <details>
                                <summary></summary>
                                <ul>
                                    <li v-for="item of getValue(k).keys" :key="item.key">
                                        <span>{{ item.title }}</span>
                                        <InputGroup :data="getValue(k)[item.key].vals" />
                                    </li>
                                </ul>
                            </details>
                        </div>
                        <!-- 颜色 -->
                        <div class="input-panel" v-else-if="(getValue(k) instanceof ColorObject)">
                            <details>
                                <summary></summary>
                                <p>当前：</p>
                                <div class="cur-color-block">
                                    <span v-if="(getValue(k) instanceof SvgColor)"
                                        :style="{ backgroundColor: getValue(k).value }"
                                        @click.stop="chooseColorObject(getValue(k))"></span>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" view-box="0,0,32,32" width="32"
                                        height="32" @click.stop="chooseColorObject(getValue(k))">
                                        <rect x="0" r="0" width="32" height="32" :fill="getValue(k).value"></rect>
                                    </svg>
                                </div>
                                <p>可选：</p>
                                <ul class="color-list">
                                    <li v-for="color in ColorList" :key="color.key"
                                        @click.stop="addColorObject(k, color.key)">
                                        <img :src="color.ico" :alt="color.title">
                                    </li>
                                </ul>
                            </details>
                        </div>
                        <!-- 多值设置 -->
                        <div class="input-panel" v-else-if="(getValue(k) instanceof MultipleValueObject)">
                            <details>
                                <summary></summary>
                                <InputGroup :data="getValue(k).vals" />
                            </details>
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <div v-else class="preview">
            <h3>预览</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,500,500" version="1.1" width="500" height="500">
                <use :href="'#' + mouse.arg" />
            </svg>
        </div>
    </div>
</template>
<style scoped>
.right {
    overflow-y: auto;
    padding: 1rem 0.5rem;
    color: #6c6c6c;
    background-color: #242424;
    border-radius: 0.3rem;
}

.right h3 {
    color: #545454;
    font-size: 0.9rem;
}

.right-plane-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0 1em;
}

.right-plane-item {
    user-select: none;
}

.right-plane-item:not(.right-plane-item:empty) {
    border-bottom: solid 1px #1a1a1a;
    padding: 0.5rem 0;
}

.right-plane-item>span {
    color: #6c6c6c;
    font-size: 0.9rem;
}

.right-plane-item input:not(input[type='color']) {
    width: 5em;
    color: #fff;
    background-color: #1a1a1a;
    outline: none;
    border: none;
    padding: 6px;
}

.input-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0.5rem 0;
}

.input-panel ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.input-panel details {
    text-align: right;
}

.input-panel summary {
    text-align: right;
}

.preview svg {
    width: 100%;
    aspect-ratio: 1/1;
    height: 100%;
}

.cur-color-block {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.cur-color-block span,
.cur-color-block svg {
    width: 2rem;
    height: 2rem;
}

.color-list {
    display: flex;
    gap: 1px;
}</style>