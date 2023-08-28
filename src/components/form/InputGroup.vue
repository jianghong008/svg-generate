<script setup lang="ts">

interface InputFormItem {
    type: 'number' | 'text' | 'color',
    title: string,
    val:any
}

defineProps<{
    data: InputFormItem[]
}>()

const onchange = (e:InputFormItem) => {
    if(e.val===''&&e.type==='number'){
        e.val = 0;
    }
}

</script>
<template>
    <div class="input-group">
        <label v-for="(d, i) in data" :key="i">
            <span>{{ d.title }}:&nbsp;</span>
            <input :type="d.type" v-model="d.val" @input="onchange(d)">
        </label>
    </div>
</template>
<style lang="css" scoped>
.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}
.input-group input{
    width: 4rem;
}
.input-group input:not(input[type='color']) {
    width: 5em;
    color: #fff;
    background-color: #1a1a1a;
    outline: none;
    border: none;
    padding: 6px;
}
.input-group select{
    color: #fff;
    background-color: #1a1a1a;
    outline: none;
    border: none;
    padding: 6px;
}
</style>