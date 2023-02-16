import storage from "good-storage";

import MusicList from "@/components/music-list/MusicList";
import { processSongs } from "@/service/song";
import dataDetail from "@/cache/singerDetail.json";
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList,
    },
    props: {
      data: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      };
    },
    computed: {
      pic() {
        const data = this.computedData;
        return data && data.pic;
      },
      title() {
        const data = this.computedData;
        return data && (data.name || data.title);
      },
      computedData() {
        let ret = null;
        const data = this.data;
        if (data) {
          ret = data;
        } else {
          const cacheData = storage.session.get(key);
          if (
            cacheData &&
            (cacheData.mid || cacheData.id + "") === this.$route.params.id
          ) {
            ret = cacheData;
          }
        }
        return ret;
      },
    },
    async created() {
      const data = this.computedData;
      if (!data) {
        const path = this.$route.matched[0].path;
        this.$router.push({ path });
        return;
      }
      // // 请求第三方接口;
      // const result = await fetch(data);
      // this.songs = await processSongs(result.songs);
      // this.loading = false;

      //本地存储json
      setTimeout(() => {
        const result = dataDetail.result;
        this.songs = result.songs;
        this.loading = false;
      }, 10);
    },
  };
}
