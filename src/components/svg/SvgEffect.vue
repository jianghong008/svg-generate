<script setup lang="ts">
import { StageObject, AnimateObject } from '@/objects/StageObject';

defineProps<{
    data: StageObject[]
}>()
</script>
<template>
    <template v-for="eo of data">
        <animate v-if="eo instanceof AnimateObject" :attributeName="eo.attributeName.value" :values="eo.values"
            :keyTimes="eo.keyTimes" :dur="eo.duration+'s'" :repeatCount="eo.repeatCount" />
    </template>
</template>