<script setup lang="ts">
import {
    ElementObjectType,
} from '@/objects/ElementObject';
import { useStage } from '@/store/stage'
const stage = useStage()
</script>
<template>
    <template v-for="el in stage.elements.children">
        <rect :data-id="el.id" v-if="el.type == ElementObjectType.rect" :x="el.x" :y="el.y" :width="el.getValue('width')"
            :height="el.getValue('height')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
            :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
            :fill="el.getValue('fill').toString()" :fill-opacity="el.getValue('fillOpacity')"
            :transform="el.transform.transformToString()" :rx="el.getValue('rx')" :ry="el.getValue('ry')">
        </rect>
        <circle :data-id="el.id" v-else-if="el.type == ElementObjectType.circle" :cx="el.x" :cy="el.y" :r="el.getValue('r')"
            :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :stroke="el.getValue('stroke').toString()"
            :stroke-width="el.getValue('strokeWidth')" :fill="el.getValue('fill').toString()"
            :fill-opacity="el.getValue('fillOpacity')" :transform="el.transform.transformToString()"></circle>
        <ellipse :data-id="el.id" v-else-if="el.type == ElementObjectType.ellipse" :cx="el.x" :cy="el.y"
            :rx="el.getValue('rx')" :ry="el.getValue('ry')"
            :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :stroke="el.getValue('stroke').toString()"
            :stroke-width="el.getValue('strokeWidth')" :fill="el.getValue('fill').toString()"
            :fill-opacity="el.getValue('fillOpacity')" :transform="el.transform.transformToString()"></ellipse>
        <path :data-id="el.id" v-else-if="el.type == ElementObjectType.path"
            :class="{ 'el-active': el.id === stage.currentObject.element?.id }" :x="el.x" :y="el.y" :d="el.pathToString()"
            :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
            :fill="el.getValue('fill').toString()" :transform="el.transform.transformToString()"
            :fill-opacity="el.getValue('fillOpacity')" />
        <text :data-id="el.id" v-else-if="el.type == ElementObjectType.text" :x="el.x" :y="el.y"
            :font-size="el.getValue('fontSize')" :class="{ 'el-active': el.id === stage.currentObject.element?.id }"
            :stroke="el.getValue('stroke').toString()" :stroke-width="el.getValue('strokeWidth')"
            :transform="el.transform.transformToString()" :fill="el.getValue('fill').toString()"
            :fill-opacity="el.getValue('fillOpacity')">
            {{ el.getValue('text') }}
        </text>
    </template>
</template>