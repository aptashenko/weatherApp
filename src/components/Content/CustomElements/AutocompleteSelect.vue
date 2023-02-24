<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import debounce from 'lodash.debounce'

const props = defineProps({
    cities: Array,
    selectedCityName: String,
    weatherData: Array
});
const emit = defineEmits(['selectCity', 'fetchCities', 'clear'])

const searchText = ref(props.selectedCityName || '')

const selectCity = (value) => {
    searchText.value = value.name;
    emit('selectCity', value)
}

const handleInput = debounce((value) => {
    if(value) {
        emit('fetchCities', value)
    }
}, 1000)

const handleClickOutside = (event) => {
  const autocomplete = document.querySelector('.autocomplete');
  if (autocomplete && !autocomplete.contains(event.target)) {
    emit('clear')
  }
};

onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})

</script>

<template>
    <div class="autocomplete">
        <input :disabled="weatherData" class="autocomplete__input" v-model="searchText" type="text" @input="handleInput($event.target.value)" />
            <ul class="autocomplete__list" v-if="props.cities.length > 0">
                <li v-for="city of props.cities" :key="city" class="autocomplete__item" @click.prevent="selectCity(city)">
                    <p>{{ city.name }}, {{ city.country }}</p>
                </li>
            </ul>
    </div>
</template>

<style lang="scss" scoped>
.autocomplete {
    position: relative;
    margin-bottom: 10px;

    &__input {
        padding: 10px;
        border: 1px solid #00000041;
        width: 100%;
    }

    &__list {
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #000;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        z-index: 9999;
    }

    &__item {
        cursor: pointer;
        padding: 10px 5px;
        &:hover {
            background-color: skyblue;
            color: #fff;
        }
        & p {
            margin: 0;
        }
    }
}

</style>