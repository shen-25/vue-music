<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img
            ref="cdImageRef"
            :class="cdCls"
            width="40"
            height="40"
            :src="currentSong.pic"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapper">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <ProgressCircle :progress="progress" :radius="32">
          <i
            :class="miniPlayIcon"
            class="icon-mini"
            @click.stop="togglePlay"
          ></i>
        </ProgressCircle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <PlayList ref="playListRef" />
    </div>
  </transition>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ProgressCircle from "./ProgressCircle.vue";
import PlayList from "./PlayList";
import useCd from "./use-cd";
import useMiniSlider from "./use-mini-slider";
export default {
  name: "MiniPlayer",
  components: { ProgressCircle, PlayList },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    togglePlay: Function,
  },
  setup() {
    const store = useStore();
    const playListRef = ref(null);
    const fullScreen = computed(() => {
      return store.state.fullScreen;
    });
    const currentSong = computed(() => {
      return store.getters.currentSong;
    });
    const playing = computed(() => {
      return store.state.playing;
    });
    const playList = computed(() => store.state.playList);

    const miniPlayIcon = computed(() => {
      return playing.value ? "icon-pause-mini" : "icon-play-mini";
    });

    const { cdCls, cdRef, cdImageRef } = useCd();
    const { sliderWrapper } = useMiniSlider();

    function showNormalPlayer() {
      store.commit("setFullScreen", true);
    }
    function showPlayList() {
      playListRef.value.show();
    }

    return {
      fullScreen,
      currentSong,
      playList,
      showNormalPlayer,
      miniPlayIcon,
      //cd
      cdCls,
      cdRef,
      cdImageRef,
      // ??????
      sliderWrapper,
      // playList
      playListRef,
      showPlayList,
    };
  },
};
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
