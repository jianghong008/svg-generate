<script setup lang="ts">
import { exportObeject,copyObeject } from '@/objects/ObjectUtils'
import { useStage } from '../store/stage';
import { useSystem } from '@/store/sys';
const {showMessage} = useSystem()
const stage = useStage()
function copySvg(){
    copyObeject(stage.elements);
    showMessage('已复制到剪切板');
}
function exportSvg(){
    exportObeject(stage.elements);
    showMessage('生成文件成功');
}
</script>
<template>
    <div class="tools-box contr">
        <button @click="copySvg">复制</button>
        <button @click="exportSvg">导出</button>
    </div>
</template>
<style lang="css" scoped>
.tools-box {
    background-color: #242424;
    border-radius: 0.3rem;
    padding: 1rem 1.5rem;
    margin-bottom: 0.1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    align-items: center;
}
.tools-box>button{
    background: none;
    outline: none;
    padding: 0.5rem 1rem;
    border-radius: 0;
    color: #fff;
}

.tools-box>button:hover{
    background: #3d3d3d;
    outline: none;
    border: none;
}
</style>