<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query"></SearchInput>
    </div>
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="item"
            v-for="item in hotKeys"
            :key="item.id"
            @click="addQuery(item.key)"
          >
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @selectSong="selectSong"
        @selectSinger="selectSinger"
      />
    </div>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component appear :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import storage from "good-storage";

import SearchInput from "@/components/search/SearchInput.vue";
import Suggest from "@/components/search/Suggest";

import { getHotKeys } from "@/service/search";
import { SINGER_KEY } from "@/assets/js/constant";
import hotKeysJson from "../../cache/hotKeys.json";
export default {
  name: "Search",
  components: {
    SearchInput,
    Suggest,
  },
  setup() {
    const query = ref("");
    const hotKeys = ref([]);
    const store = useStore();
    const router = useRouter();

    const selectedSinger = ref(null);

    setTimeout(() => {
      hotKeys.value = hotKeysJson;
    });
    // 接口失效了
    // getHotKeys().then((result) => {
    //   hotKeys.value = result.hotKeys;
    // });

    function addQuery(hotKey) {
      query.value = hotKey;
    }
    function selectSong(song) {
      store.dispatch("addSong", song);
    }
    function selectSinger(singer) {
      selectedSinger.value = singer;
      router.push({
        path: `/search/${singer.id}`,
      });
      cacheSinger(singer);
    }
    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    }
    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
    };
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
        padding-top: 4px;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
