<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" />
  </div>
</template>
<script>
import getSingerList from "@/service/singer";
import singer from "../../cache/singer.json";
import IndexList from "@/components/index-list/IndexList.vue";
export default {
  naem: "Singer",
  components: {
    IndexList,
  },
  data() {
    return {
      singers: [],
    };
  },
  async created() {
    // const result = await getSingerList();
    setTimeout(() => {
      const result = singer.result;
      this.singers = result.singers;
    }, 1);
  },
};
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 88px;
  bottom: 0;
}
</style>
