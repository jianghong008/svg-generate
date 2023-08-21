<script setup lang="ts">
import { StageObject } from '@/objects/StageObject';
import { FeGaussianBlurObject } from '@/objects/filters'
defineProps<{
    data: StageObject,
}>()
</script>
<template>
    <filter>
        <template v-for="f of data.children">
            <feGaussianBlur v-if="(f instanceof FeGaussianBlurObject)" :in="f.getValue('in')"/>
        </template>
    </filter>
</template>