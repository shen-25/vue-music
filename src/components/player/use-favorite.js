import { computed } from "vue";
import { useStore } from "vuex";

import { save, remove } from "@/assets/js/array-store";
import { FAVORITE_KEY } from "@/assets/js/constant";

export default function useFavorite() {
  const store = useStore();

  // 喜欢最大值
  const MAX_LEN = 1;

  const favoriteList = computed(() => {
    return store.state.favoriteList;
  });

  function getFavoriteIcon(song) {
    // 它依赖favoriteList favoriteList是计算属性
    return isFavorite(song) ? "icon-favorite" : "icon-not-favorite";
  }

  function isFavorite(song) {
    const index = favoriteList.value.findIndex((item) => {
      return item.id === song.id;
    });

    return index > -1;
  }

  function toggleFavorite(song) {
    let list;
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare);
    } else {
      // 限制条数后面加 MAX_LEN
      list = save(song, FAVORITE_KEY, compare);
    }
    function compare(item) {
      return item.id === song.id;
    }

    store.commit("setFavoriteList", list);
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
