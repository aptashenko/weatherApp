import { ref } from 'vue'

export const useToggle = (initVal) => {
    const isActive = ref(initVal);

    const toggle = () => {
        isActive.value = !isActive.value
    }

    return [isActive, toggle]
}