<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(["handleNavigation"])
const props = defineProps({
    page: String,
})

const choosePage = (value) => {
    if(value.nodeName === 'BUTTON') {
        emit("handleNavigation", value)
    }
}

</script>

<template>
    <div class="navigation" @click="choosePage($event.target)">
        <button id="TheBody" class="navigation__button" :class="{active: props.page === 'TheBody'}">
            Main
        </button>
        <button id="TheFavorite" class="navigation__button" :class="{active: props.page === 'TheFavorite'}">
            Favorite
        </button>
    </div>
</template>

<style lang="scss" scoped>
.navigation {
    display: flex;
    &__button {
        background: #E9EDC9;
        border: none;
        padding: 10px;
        border-radius: 10px 10px 0 0;
        cursor: pointer;
        &:not(:last-child) {
            margin-right: 10px;
        }
    }
}

.active {
    background: #CCD5AE;
}
</style>