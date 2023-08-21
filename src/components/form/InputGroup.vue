<script setup lang="ts">
import { ref } from 'vue';

interface InputFormItem {
    type: 'number' | 'text' | 'color',
    title: string,
}
const vals = ref<string[]>()
defineProps<{
    data: InputFormItem[]
}>()
const emits = defineEmits(['onchange'])
const onchange = () => {
    emits('onchange');
    console.log(vals)
}

</script>
<template>
    <div class="input-group">
        <label v-for="(d, i) in data" :key="i">
            <span>{{ d.title }}</span>
            <input :type="d.title" v-model="vals" @change="onchange">
        </label>
    </div>
</template>
<style lang="css" scoped>
.input-group {
    display: flex;
    flex-direction: column;
}
</style>