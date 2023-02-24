<script setup>
import { ref, watchEffect, defineProps, defineEmits } from "vue";
import AutocompleteSelect from "../CustomElements/AutocompleteSelect.vue";
import { fetchCities, fetchWeather } from "@/api";
import { filterСoincidences, getFromLocalStorage } from "@/utils";
import WeatherCard from "../Items/WeatherCard.vue";
import ChartCard from "../Items/Chart/ChartCard.vue";
import { useToggle } from "@/composables/useToggle";
import TheModal from "../CustomElements/TheModal.vue";

const [isActive, toggle] = useToggle(false);
const [showChart, toggleshowChart] = useToggle(false);
const [warning, toggleWarning] = useToggle(false);

const props = defineProps({
  selectedCity: String,
  id: Number,
  counts: Number,
  blocksCount: Array,
  isFavorite: Boolean,
});

const emit = defineEmits([
  "updateName",
  "removeBlock",
  "addBlock",
  "addToFavorite",
]);

const suggestions = ref([]);
const weatherData = ref(null);
const loading = ref(true);
const errorMessage = ref("");

const fetchSuggestions = async (value) => {
  const data = await fetchCities(value);
  suggestions.value = filterСoincidences(data).map((item) => ({
    name: item.name,
    country: item.country,
  }));
};

const setWeather = async (cityName) => {
  const response = await fetchWeather(cityName);
  if (response.cod === 200) {
    weatherData.value = response;
    loading.value = false;
    errorMessage.value = "";
  } else {
    errorMessage.value = response.response.data.message;
  }
};

const clearSuggestiong = () => {
  suggestions.value = [];
};

const handleCity = (value, id) => {
  suggestions.value = [];
  emit("updateName", id, value);
};

const confirmRemoving = () => {
  emit("removeBlock", props.id);
};

const addNewBlock = () => {
  const maxId = Math.max(...props.blocksCount.map((item) => item.id));
  emit("addBlock", maxId);
};

const handleFavorite = (data) => {
  const favoriteItems = getFromLocalStorage("favorite") || [];
  if (favoriteItems.length > 4) {
    toggleWarning();
  } else {
    emit("addToFavorite", data);
  }
};

watchEffect(() => {
  if (props.selectedCity) {
    setWeather(props.selectedCity);
  }
});
</script>

<template>
  <div v-if="props.counts === 1" class="add">
    <button class="add__button" @click="addNewBlock">ADD NEW</button>
  </div>
  <section class="body" :class="{ favorite: props.isFavorite }">
    <div class="body__head">
      <div class="">
        <AutocompleteSelect
          @selectCity="handleCity($event, props.id)"
          @fetchCities="fetchSuggestions"
          @clear="clearSuggestiong"
          :weatherData="weatherData"
          :selectedCityName="props.selectedCity"
          :cities="suggestions"
          placeholder="Type a city"
        />
        <div>
          <WeatherCard v-if="!loading" :data="weatherData" />
          <div v-if="loading && props.selectedCity && !errorMessage">
            <p>Loading...Wait....</p>
          </div>
          <div v-if="errorMessage">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>

    <div class="body__buttons">
      <button
        v-if="weatherData"
        :disabled="!props.selectedCity || props.isFavorite"
        class="body__buttonFavorite"
        @click="handleFavorite(props.counts - 1)"
      >
        {{ props.isFavorite ? "Is favorite" : "To favorite" }}
      </button>
      <button class="body__delete" @click="toggle">Remove</button>
      <button v-if="weatherData" class="body__chartBtn" @click="toggleshowChart">
        {{ showChart ? 'Hide chart' : 'Show chart' }}
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
        <div class="body__closeMenu">
          <button class="yes" @click="confirmRemoving">Yes</button>
          <button class="no" @click="toggle">No</button>
        </div>
      </div>
    </TheModal>
    <TheModal :isActive="warning" @toggle="toggleWarning">
      <div>
        <h2>You already have 5 items in your favorites.</h2>
        <p>You must remove some of them first</p>
        <button @click="toggleWarning">OK</button>
      </div>
    </TheModal>
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

  &__closeMenu {
    display: flex;
    justify-content: center;

    & .yes {
      background: #CCD5AE;
      border: none;
      margin-right: 10px;
      cursor: pointer;
      transition: all 250ms linear;

      &:hover {
        transform: scale(1.1);
      }
    }

    & .no {
      background: #D4A373;
      border: none;
      cursor: pointer;
      transition: all 250ms linear;

      &:hover {
        transform: scale(1.1);
      }
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

    &:disabled {
      opacity: 0.3;

      &:hover {
        box-shadow: none;
        background: #ccd5ae;
      }
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
}

.add {
  &__button {
    border: none;
    background: #fff;
    border: 1px solid #e63946;
    color: #000;
    font-weight: 900;
    font-size: 20px;
    border-radius: 10px;
    margin-left: auto;
    display: block;
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
}

.favorite {
  background: #e9edc9;
  border: 2px solid #d4a373;
}
</style>
