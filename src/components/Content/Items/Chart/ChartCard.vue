<script setup>
import TheChart from '../TheChart.vue';
import { defineProps, ref, onMounted } from 'vue';
import { fetchWeatherChartData } from '@/api'
import dayjs from 'dayjs';

const props = defineProps({
    currentCity: String
})

const weatherInfo = ref(null);
const chartData = ref({
    labels: null,
    datasets: [
        {
            label: 'temp',
            data: null,
        }
    ]
})

const loading = ref(true);


const fetchWeatherData = async (city) => {
    try {
        weatherInfo.value = await fetchWeatherChartData(city)
    } catch (error) {
        throw new Error(error)
    } finally {
        loading.value = false;
    }
} 


onMounted( async () => {
    await fetchWeatherData(props.currentCity)
    chartData.value.labels = weatherInfo.value.list.map(item => dayjs(item.dt_txt).format('DD.MM.YYYY h:mm A'))
    chartData.value.datasets[0].data = weatherInfo.value.list.map(item => item.main.temp)
})

</script>

<template>
    <div class="chart" v-if="!loading">
        <TheChart v-if="chartData.labels" :weather-data="chartData" />
    </div>
    <div v-if="loading">
        <p>Loading....wait....</p>
    </div>
</template>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>