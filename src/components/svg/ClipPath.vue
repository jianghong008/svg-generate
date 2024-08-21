<script lang="ts" setup>
import { ClipPathObject } from '@/objects/ElementObject';
import SvgChild from './SvgChild.vue';

defineProps<{
    data: ClipPathObject[],
}>()
</script>
<template>
    <clipPath v-for="cp of data" :id="cp.id" :clipPathUnits="cp.clipPathUnits">
        <SvgChild :data="cp.children"/>
    </ClipPath>
</template>