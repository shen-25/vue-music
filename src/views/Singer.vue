<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component appear :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>
<script>
import storage from "good-storage";

import { getSingerList } from "@/service/singer";
import singer from "@/cache/singer.json";
import IndexList from "@/components/index-list/IndexList.vue";
import { SINGER_KEY } from "@/assets/js/constant";

export default {
  name: "Singer",
  components: {
    IndexList,
  },
  data() {
    return {
      singers: [],
      selectedSinger: null,
    };
  },
  async created() {
    // const result = await getSingerList();
    // this.singers = result.singers;

    setTimeout(() => {
      const result = singer.result;
      this.singers = result.singers;
    }, 100);
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer;
      this.cacheSinger(singer);
      this.$router.push({
        path: `/singer/${singer.mid}`,
      });
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    },
  },
};
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
}
</style>
