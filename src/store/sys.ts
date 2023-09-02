import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';

export const useSystem = defineStore('system', () => {
    const message = reactive({
        text: '',
        show: false,
    })
    let msgTimer: any;
    const showMessage = (s: string,dur:number=2500) => {
        clearTimeout(msgTimer);
        message.text = s;
        message.show = true;
        msgTimer = setTimeout(() => {
            message.text = '';
            message.show = false;
        }, dur)
    }
    return {
        message,
        showMessage,
    }
})