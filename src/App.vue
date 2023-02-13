<template>
  <Header />
  <Tab />
  <router-view :style="viewStyle"></router-view>
  <Player />
</template>

<script>
import Header from "@/components/header/Header";
import Tab from "@/components/tab/Tab";
import Player from "@/components/player/Player";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {
    Header,
    Tab,
    Player,
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? "50px" : "0";
      return {
        bottom,
      };
    },
    ...mapState(["playList"]),
  },
};
</script>

<style lang="scss"></style>
