<script setup lang="ts">
import { SvgColor } from '@/objects/Color';
import { useStage } from '@/store/stage';
import { computed, reactive, ref, watch } from 'vue';
import { ColorObject, ColorList, RadialGradient, LinearGradient } from '@/objects/Color'
import {
    EffctEnum, StageObecjArray,
    AnimateAttribute, MultipleValueObject,
    MultipleValueListObject, SelectObject
} from '@/objects/ObjectUtils'
import { ElementObject, ElementObjectType } from '@/objects/ElementObject'
import { StageObject } from '@/objects/StageObject';
import InputGroup from './form/InputGroup.vue'
import { useSystem } from '@/store/sys';

const { showMessage } = useSystem()
const { currentObject, chooseElement, chooseChild, addColorGradient, mouse, elements,useObject } = useStage();

function setValue(key: string, input: EventTarget | null, isString = false) {
    if (!input) {
        return
    }
    const val = isString ? ((input as any).value) : Number((input as any).value);

    if (!currentObject.element) {
        return
    }
    if (Reflect.get(currentObject.element, key) instanceof SelectObject) {
        Reflect.set(currentObject.element, 'new_' + key, val);
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

    try {
        currentObject.element.addAnimate(Number(input.value) as EffctEnum)
    } catch (error: any) {
        showMessage(error.message)
    }
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
const getRefsObject = (ar: SelectObject) => {
    const temp = []
    for (const o of elements.children) {
        if (o.id != currentObject.element?.parent?.id) {
            temp.push(o);
        }
    }
    return ar.getVals(temp)
}
const chooseColorObject = (color: ColorObject) => {
    currentObject.child = color;
}
const previewSvg = ref<HTMLElement>();
const previewUse = ref<HTMLElement>();
const previewUseTransform = ref('scale(1)');
const previewPosition = reactive({
    x: 0,
    y: 0,
    loading: true,
})
const resizePreview = () => {
    if (!mouse.arg || !previewSvg.value || !previewUse.value || mouse.curElType != ElementObjectType.group) {
        return
    }

    const rect1 = previewSvg.value.getBoundingClientRect();
    const rect2 = previewUse.value.getBoundingClientRect();

    const ratio = rect2.width / rect2.height;

    const scale = ratio >= 1 ? (rect1.width / rect2.width / 2) : (rect1.height / rect2.height / 2);

    if (scale === Infinity || scale < 1) {
        return
    }
    previewUseTransform.value = `scale(${scale})`;

    const x = (rect1.width / 2 - rect2.width / 2) * scale;
    const y = (rect1.height / 2 - rect2.height / 2) * scale;
    previewPosition.x = x;
    previewPosition.y = y;

    previewPosition.loading = false;
}
let timer: any;
watch(mouse, () => {

    clearTimeout(timer);
    previewPosition.loading = true;
    previewUseTransform.value = `scale(1)`;
    if (mouse.curElType != ElementObjectType.group) {
        return
    }
    timer = setTimeout(resizePreview, 1000);
})
</script>
<template>
    <div class="right">
        <template v-if="!mouse.arg || mouse.curElType !== ElementObjectType.group">
            <h3>属性</h3>
            <div class="right-plane" v-if="currentObject.element">
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
                                <ul class="animates">
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
                                    <span class="btn" @click="addEffect(k)">添加</span>
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
                        <select v-else-if="(getValue(k) instanceof SelectObject) && getValue(k).type === 'const'"
                            :value="getValue(k).value" @change="setValue(k, $event.target, true)">
                            <option v-for="e in getValue(k).vals" :key="e.value" :selected="getValue(k).value == e.value"
                                :value="e.value">
                                {{ e.title }}
                            </option>
                        </select>
                        <select v-else-if="(getValue(k) instanceof SelectObject) && getValue(k).type === 'refs'"
                            :value="getValue(k).value" @change="setValue(k, $event.target, true)"
                            :title="getValue(k).value">
                            <option v-for="e in getRefsObject(getValue(k))" :key="e.value"
                                :selected="getValue(k).value == e.value" :value="e.value">
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
                                        <img :src="color.ico" :alt="color.title" :title="color.title">
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
            <svg ref="previewSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,500,500" version="1.1" width="500"
                height="500">
                <text v-show="previewPosition.loading" x="50%" y="50%" font-size="28" transform-origin="50% 50%"
                    transform="translate(-68)">loading</text>
                <use ref="previewUse" :x="previewPosition.x" :y="previewPosition.y" :href="'#' + mouse.arg"
                    :transform="previewUseTransform" :transform-origin="previewPosition.x + ' ' + previewPosition.y"
                    :style="{ opacity: previewPosition.loading ? 0 : 1 }" />
            </svg>
        </div>
    </div>
</template>
<style scoped>
.right {
    overflow-y: auto;
    padding: 1rem 1rem;
    color: #6c6c6c;
    background-color: #242424;
    border-radius: 0.3rem;
}

.right h3 {
    color: #c1c1c1;
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
    color: #8f8f8f;
    font-size: 0.9rem;
}

.right input:not(input[type='color']) {
    width: 5em;
    color: #fff;
    background-color: #1a1a1a;
    outline: none;
    border: none;
    padding: 6px;
}

.right select {
    color: #fff;
    background-color: #1a1a1a;
    outline: none;
    border: none;
    padding: 6px;
}

.right-plane-item select option {
    outline: none;
    border: none;
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
    background-color: #fff;
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
    outline: dashed 1px rgb(162, 162, 162);
}

.color-list {
    display: flex;
    gap: 1px;
}

.btn {
    background: #3a3a3a;
    color: #fff;
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    margin: 0.2rem;
    cursor: pointer;
}

.btn:hover {
    background: #2c2c2c;
}

.animates li {
    margin: 0.5rem;
    color: #fff;
    padding: 0.2rem;
    border-radius: 0.3rem;
    text-align: left;
}

.animates li:hover {
    background-color: #026d9d;
}
</style>