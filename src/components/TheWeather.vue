<script setup>
import { ref, computed } from "vue";
import TheHeader from "./Content/TheHeader.vue";
import TheBody from "./Content/Screens/TheBody.vue";
import TheFavorite from "./Content/Screens/TheFavorite.vue";
import {
  addToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "@/utils";
import TheNavigation from "./Content/TheNavigation.vue";

const blocksCount = ref([
  {
    id: 1,
    name: null,
  },
]);
const favoriteBlocks = ref(
  getFromLocalStorage("favorite") || [{ id: 1, name: null }]
);

const pages = [{ name: TheBody }, { name: TheFavorite }];

const page = ref(pages[0]);

const currentBlocks = computed(() => {
  if (page.value.name.__name === "TheBody") {
    return blocksCount.value;
  } else {
    return favoriteBlocks.value;
  }
});

const updateBlocksName = (id, newItem) => {
  const currentItem = blocksCount.value.find((item) => item.id === id);
  currentItem.name = newItem.name;
};

const addBlock = (maxId) => {
  if (blocksCount.value.length !== 5) {
    blocksCount.value.push({ id: maxId + 1, name: null });
  }
};

const removeBlock = (id) => {
  blocksCount.value = blocksCount.value.filter((item) => item.id !== id);
};

const handleNavigation = (value) => {
  page.value = pages.find((item) => item.name.__name === value.id);
};

const addToFavorite = (idx) => {
  const newMap = new Map(Object.entries(blocksCount.value[idx]));
  newMap.set("favorite", true);
  blocksCount.value[idx] = Object.fromEntries(newMap);
  addToLocalStorage("favorite", Object.fromEntries(newMap));
  updateFavoriteBlock();
};

const removeFromFavorite = (id) => {
  const currentData = getFromLocalStorage("favorite");
  const filteredData = currentData.filter((item) => item.id !== id);
  removeFromLocalStorage("favorite", filteredData);
};

const updateFavoriteBlock = () => {
  favoriteBlocks.value = getFromLocalStorage("favorite") || [
    { id: 1, name: null },
  ];
};
</script>

<template>
  <div class="wrapper">
    <TheHeader />
    <div class="content">
      <TheNavigation :page="page.name.__name" @handleNavigation="handleNavigation" />
      <KeepAlive>
        <component
          :is="page.name"
          v-for="(block, idx) of currentBlocks"
          :key="block.id"
          :id="block.id"
          :pageName="page.name.__name"
          :selectedCity="block.name"
          :counts="idx + 1"
          :blocksCount="currentBlocks"
          :isFavorite="block.favorite"
          @getData="handleNavigation"
          @updateName="updateBlocksName"
          @removeBlock="removeBlock"
          @addBlock="addBlock"
          @addToFavorite="addToFavorite"
          @removeFromFavorite="removeFromFavorite"
          @updateFavoriteBlock="updateFavoriteBlock"
        />
      </KeepAlive>
    </div>
  </div>
</template>

<style lang="scss">
.wrapper {
  max-width: 1200px;
  min-width: 360px;
  margin: 0 auto;
  background: #faedcd;
  min-height: 100vh;
}

.content {
  padding: 10px;
}
</style>
