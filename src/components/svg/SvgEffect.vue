<script setup lang="ts">
import { StageObject, AnimateObject, AnimateTransformObject, AnimateMotionObject } from '@/objects/StageObject';

defineProps<{
    data: StageObject[]
}>()
</script>
<template>
    <template v-for="eo of data">
        <animate v-if="eo instanceof AnimateObject" :attributeName="eo.attributeName.value" :values="eo.values"
            :keyTimes="eo.keyTimes" :dur="eo.duration + 's'" :repeatCount="eo.repeatCount" />
        <animateTransform v-else-if="(eo instanceof AnimateTransformObject)" attributeName="transform" attributeType="XML"
            :type="eo.transformType.value" :from="eo.fromValue" :to="eo.toValue" :dur="eo.duration + 's'"
            :repeatCount="eo.repeatCount" />
        <animateMotion v-else-if="(eo instanceof AnimateMotionObject)" :dur="eo.duration + 's'" :repeatCount="eo.repeatCount">
            <mpath :href="'#'+eo.mpath.value"/>
        </animateMotion>
    </template>
</template>