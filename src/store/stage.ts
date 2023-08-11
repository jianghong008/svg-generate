import { defineStore } from 'pinia'
import { reactive } from 'vue';

export const useStage = defineStore('stage',()=>{
    const elements = reactive<StageElement[]>([]);
    const mouse = reactive({
        down:false,
        curElType:'',
        elMouse:false,
    })
    return {
        elements,
        mouse,
    }
})