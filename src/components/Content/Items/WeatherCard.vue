<script setup>
import { defineProps } from 'vue';
import dayjs from 'dayjs'
const props = defineProps({
    data: Object,
})

</script>

<template>
    <div class="card">
        <p class="card__date">{{ dayjs().format('MMMM D, YYYY h:mm A') }}</p>
        <div class="card__name">
            <p class="card__cityname">{{ props.data.name }}, {{ props.data.sys.country }}</p>
            <p class="card__temp">{{ Math.round(props.data.main.temp) }}°C</p>
            <div class="card__image">
                <img :src="`http://openweathermap.org/img/wn/${props.data.weather[0].icon}@2x.png`" />
            </div>
        </div>
        <p>Feels like {{ Math.round(props.data.main.feels_like) }}°C, {{ props.data.weather[0].description }}</p>
    </div>
</template>

<style lang="scss" scoped>
.card {
    background: #217074;
    border-radius: 25px;
    width: fit-content;
    padding: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    min-height: 200px;
    flex-basis: 25%;

    &__name {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__cityname {
        font-size: 20px;
        font-weight: bold;
    }

    &__temp {
        font-size: 20px;
    }

    &__image {
        position: relative;
        width: 50px;
        height: 50px;

        & img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>