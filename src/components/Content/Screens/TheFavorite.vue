<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  watchEffect,
  onMounted,
  onUpdated,
} from "vue";
import { fetchWeather } from "@/api";
import WeatherCard from "../Items/WeatherCard.vue";
import ChartCard from "../Items/Chart/ChartCard.vue";
import { useToggle } from "@/composables/useToggle";
import TheModal from "../CustomElements/TheModal.vue";

const [isActive, toggle] = useToggle(false);

const [showChart, toggleshowChart] = useToggle(false);

const props = defineProps({
  id: Number,
  counts: Number,
  blocksCount: Object,
  selectedCity: String,
  pageName: String,
});

const emit = defineEmits([
  "updateName",
  "removeBlock",
  "updateFavoriteBlock",
  "addBlock",
  "getData",
  "removeFromFavorite",
]);

const weatherData = ref(null);

const setWeather = async (cityName) => {
  const response = await fetchWeather(cityName);
  weatherData.value = response;
};

const confirmRemoving = () => {
  emit("removeBlock", props.id);
};

const isFavorites = props.blocksCount.some((item) => item.favorite);

watchEffect(() => {
  if (props.selectedCity) {
    setWeather(props.selectedCity);
  }
});

onMounted(() => {
  emit("updateFavoriteBlock");
});

onUpdated(() => {
  console.log("update");
});

const handleRemove = () => {
  emit("removeFromFavorite", props.id);
  emit("updateFavoriteBlock");
};
</script>

<template>
  <section class="body" v-if="isFavorites">
    <div class="body__head">
      <div v-if="weatherData" class="body__weatherInfo">
        <WeatherCard :data="weatherData" />
      </div>
    </div>

    <div class="body__buttons">
      <button class="body__buttonFavorite" @click="handleRemove">
        Remove from favorite
      </button>
      <button
        v-if="weatherData"
        class="body__chartBtn"
        @click="toggleshowChart"
      >
        {{ showChart ? "Hide chart" : "Show chart" }}
      </button>
    </div>
    <TheModal :isActive="showChart" @toggle="toggleshowChart">
      <div class="body__chartCard">
        <ChartCard :currentCity="props.selectedCity" />
      </div>
    </TheModal>
    <TheModal :isActive="isActive" @toggle="toggle">
      <div>
        <h2>Are you sure what to close?</h2>
        <button @click="confirmRemoving">Yes</button>
        <button @click="toggle">No</button>
      </div>
    </TheModal>
  </section>
  <section v-else>
    <h2>Sorry, but you don't have favorite cities yet.</h2>
  </section>
</template>

<style lang="scss" scoped>
.body {
  position: relative;
  display: flex;
  padding: 20px;
  border-radius: 30px;
  margin-top: 20px;
  background: #fefae0;
  transition: all 250ms linear;
  width: fit-content;

  &__buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-left: 20px;

    @media (max-width: 768px) {
      margin-left: 10px;
    }
  }

  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__weatherInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__delete {
    border: none;
    background: #e63946;
    border: 1px solid #fff;
    color: #000;
    font-weight: 900;
    font-size: 20px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: all 250ms linear;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    &:hover {
      box-shadow: 0px 0px 20px -6px #d4a373;
      color: #fff;
    }
  }

  &__buttonFavorite {
    border: none;
    background: #fff;
    border: 1px solid #e63946;
    color: #000;
    font-weight: 900;
    font-size: 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 250ms linear;

    &:hover {
      box-shadow: 0px 0px 20px -6px #d4a373;
      background: #e63946;
      border-color: #fff;
      color: #fff;
    }

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  &__chartCard {
    width: 60vw;
    height: 300px;
    max-width: 600px;

    @media (max-width: 768px) {
      width: 85vw;
      height: 170px;
    }
  }

  &__chartBtn {
    border: none;
    background: #fff;
    border: 1px solid #e63946;
    color: #000;
    font-weight: 900;
    font-size: 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 250ms linear;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    &:hover {
      box-shadow: 0px 0px 20px -6px #d4a373;
      background: #e63946;
      border-color: #fff;
      color: #fff;
    }
  }
}

</style>
