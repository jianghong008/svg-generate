<script setup lang="ts">
import { StageObject } from '@/objects/StageObject';
import {
    ElementObjectType,
} from '@/objects/ElementObject';
import SvgChild from './SvgChild.vue';
defineProps<{
    data: StageObject,
}>()
</script>
<template>
    <g :id="data.id" v-if="data.type == ElementObjectType.group" :stroke="data.getValue('stroke').value"
        :stroke-width="data.getValue('strokeWidth')" :fill="data.getValue('fill').value"
        :fill-opacity="data.getValue('fillOpacity')">
        <SvgChild :data="data.children" />
    </g>
</template>