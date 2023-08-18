<script setup lang="ts">
import { SvgColor } from '@/objects/Color';
import { useStage } from '@/store/stage';
import { computed } from 'vue';
import { EffctEnum, StageObecjArray,AnimateAttribute } from '@/objects/ObjectUtils'
import { ElementObject } from '@/objects/ElementObject'
import { StageObject,TransformObject } from '@/objects/StageObject';
const { currentObject, chooseElement } = useStage();
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
        const old = Reflect.get(currentObject.element,key)
        if(typeof old==='object'&& old !== undefined && old !== null){
            setObjectVal(key,val);
        }else{
            Reflect.set(currentObject.element, key, val);
        }
    }
}
// 特殊类型
function setObjectVal(key:string, val:string){
    if (!currentObject.element) {
        return
    }
    const old = Reflect.get(currentObject.element,key);
    if(old === undefined || old === null){
        return
    }
    if(old instanceof AnimateAttribute){
        //动画属性
        Reflect.set(currentObject.element, key, new AnimateAttribute(val));
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
    const input = window.document.getElementById(currentObject.element?.id + '_' + key) as HTMLInputElement;
    if (!input) {
        return
    }
    if (!currentObject.element) {
        return
    }

    currentObject.element.addChild(Number(input.value) as EffctEnum)
}
const chooseEffect = (id?: StageObject) => {
    chooseElement(id)
}

const getObjKeys = (obj:any)=>{
    return Reflect.ownKeys(obj);
}
</script>
<template>
    <div class="right">
        <h3>属性</h3>
        <div class="right-plane" v-if="currentObject.element">
            <h4>{{ currentObject.element.name }}</h4>
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
                    <!-- 特效 -->
                    <div class="input-panel" v-else-if="(getValue(k) instanceof StageObecjArray)">
                        <details>
                            <summary>集合</summary>
                            <ul>
                                <li v-for="a in currentObject.element.children" :key="a.id"
                                    v-show="!(a instanceof ElementObject)" @click="chooseEffect(a)">
                                    {{ a.name }}
                                </li>
                            </ul>
                        </details>
                        <div>
                            <select :id="currentObject.element.id + '_' + k">
                                <option v-for="e in StageObecjArray.EffctObjects" :key="e.key" :value="e.key">
                                    {{ e.title }}
                                </option>
                            </select>
                            <button @click="addEffect(k)">添加</button>
                        </div>
                    </div>
                    <!-- 动画属性 -->
                    <select v-else-if="(getValue(k) instanceof AnimateAttribute)" :value="getValue(k)" @change="setValue(k, $event.target,true)">
                        <option v-for="e in AnimateAttribute.GetAttributs(currentObject.element?.parent)" :key="e" :value="e">
                            {{ e }}
                        </option>
                    </select>
                    <!-- 变换 -->
                    <div class="input-panel" v-else-if="(getValue(k) instanceof TransformObject)">
                        <details>
                            <summary>集合</summary>
                            <ul>
                                <li v-for="key in getObjKeys(getValue(k))" :key="key"
                                    v-show="(typeof key !== 'function')" @click="chooseEffect(getObjKeys(getValue(k)) as StageObject)">
                                    {{ key }}
                                </li>
                            </ul>
                        </details>
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

.right-plane-item {
    user-select: none;
}

.right-plane-item input:not(input[type='color']) {
    width: 5em;
}

.input-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0.5rem 0;
}

.input-panel ul{
    list-style: none;
    margin: 0;
    padding: 0;
}
</style>