<script setup lang="ts">
import { ElementObjectType, } from '@/objects/ElementObject';
import { useStage } from '@/store/stage'
import SvgEffect from './SvgEffect.vue';
import { StageObject } from '@/objects/StageObject';
import GroupDef from './GroupDef.vue';
import { LinearGradient, RadialGradient } from '@/objects/Color';
const stage = useStage()
defineProps<{
    data: StageObject[],
}>()
</script>
<template>
    <g v-for="el in data" :key="el.id">
        <rect :data-id="el.id" v-if="el.type == ElementObjectType.rect" :x="el.x" :y="el.y" :width="el.getValue('width')"
            :height="el.getValue('height')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
            :stroke="el.getValue('stroke').value" :stroke-width="el.getValue('strokeWidth')"
            :fill="el.getValue('fill').value" :fill-opacity="el.getValue('fillOpacity')"
            :transform-origin="el.transform.origin" :transform="el.transform.transformToString()" :rx="el.getValue('rx')"
            :ry="el.getValue('ry')">
            <SvgEffect :data="el.children" />
        </rect>
        <ellipse :data-id="el.id" v-else-if="el.type == ElementObjectType.ellipse" :cx="el.x" :cy="el.y"
            :rx="el.getValue('rx')" :ry="el.getValue('ry')"
            :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :stroke="el.getValue('stroke').value"
            :stroke-width="el.getValue('strokeWidth')" :fill="el.getValue('fill').value"
            :fill-opacity="el.getValue('fillOpacity')" :transform-origin="el.transform.origin"
            :transform="el.transform.transformToString()">
            <SvgEffect :data="el.children" />
        </ellipse>
        <path :data-id="el.id" v-else-if="el.type == ElementObjectType.path"
            :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :x="el.x" :y="el.y" :d="el.pathToString()"
            :stroke="el.getValue('stroke').value" :stroke-width="el.getValue('strokeWidth')"
            :fill="el.getValue('fill').value" :transform-origin="el.transform.origin"
            :transform="el.transform.transformToString()" :fill-opacity="el.getValue('fillOpacity')">
            <SvgEffect :data="el.children" />
        </path>
        <text :data-id="el.id" v-else-if="el.type == ElementObjectType.text" :x="el.x" :y="el.y"
            :font-size="el.getValue('fontSize')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
            :stroke="el.getValue('stroke').value" :stroke-width="el.getValue('strokeWidth')"
            :transform-origin="el.transform.origin" :transform="el.transform.transformToString()"
            :fill="el.getValue('fill').value" :fill-opacity="el.getValue('fillOpacity')">
            {{ el.getValue('text') }}
            <SvgEffect :data="el.children" />
        </text>
        <use :data-id="el.id" v-else-if="el.type == ElementObjectType.use" :width="el.getValue('width')"
            :height="el.getValue('height')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
            :href="el.getValue('href').value" :x="el.x" :y="el.y" :transform-origin="el.transform.origin"
            :transform="el.transform.transformToString()">
            <SvgEffect :data="el.children" />
        </use>

        <linearGradient :id="el.id" v-else-if="(el instanceof LinearGradient)"
            :gradientTransform="el.getValue('gradientTransform')">
            <stop v-for="(stop, index) in el.children" :key="index" :offset="stop.getValue('offset') + '%'"
                :stop-color="stop.getValue('stopColor')" />
        </linearGradient>
        <radialGradient :id="el.id" v-else-if="(el instanceof RadialGradient)">
            <stop v-for="(stop, index) in el.children" :key="index" :offset="stop.getValue('offset') + '%'"
                :stop-color="stop.getValue('stopColor')" />
        </radialGradient>
        <GroupDef :data="el" />
    </g>
</template>
<style scoped>
.el-active {
    outline: dashed 1px #FF5722;
}

path,
rect,
g,
use,
text,
ellipse {
    cursor: grab;
    user-select: none;
}
</style>