<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :title="title" :pic="pic" :loading="loading" />
  </div>
</template>

<script>
import storage from "good-storage";

import { getSingerDetail } from "@/service/singer";
import singerDetail from "../../cache/singerDetail.json";
import { processSongs } from "@/service/song";
import MusicList from "@/components/music-list/MusicList.vue";
import { SINGER_KEY } from "@/assets/js/constant";

export default {
  name: "SingerDetail",
  components: {
    MusicList,
  },
  props: {
    singer: Object,
  },
  data() {
    return {
      songs: [],
      loading: true,
    };
  },
  computed: {
    pic() {
      const singer = this.computedSinger;
      return singer && singer.pic;
    },
    title() {
      const singer = this.computedSinger;
      return singer && singer.name;
    },
    computedSinger() {
      let ret = null;
      const singer = this.singer;
      if (singer) {
        ret = singer;
      } else {
        const cacheSinger = storage.session.get(SINGER_KEY);
        if (cacheSinger && cacheSinger.mid === this.$route.params.id) {
          ret = cacheSinger;
        }
      }
      return ret;
    },
  },
  async created() {
    if (!this.computedSinger) {
      const path = this.$route.matched[0].path;
      this.$router.push({ path });
      return;
    }

    // // 请求第三方接口;
    // const result = await getSingerDetail(this.computedSinger);
    // this.songs = await processSongs(result.songs);
    // this.loading = false;

    //本地存储json
    setTimeout(() => {
      const result = singerDetail.result;
      this.songs = result.songs;
      this.loading = false;
    }, 10);
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
