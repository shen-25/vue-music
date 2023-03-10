<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      ref="cdWrapperRef"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click.stop="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>

          <Scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </Scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                ref="progressBarRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer :progress="progress" :toggle-play="togglePlay" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, watch, nextTick } from "vue";

import ProgressBar from "./ProcessBar.vue";
import Scroll from "@/components/base/scroll/Scroll.vue";
import MiniPlayer from "./MiniPlayer.vue";

import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCd from "./use-cd";
import useLyric from "./use-lyric";
import useMiddleInteractive from "./use-middle-interactive";
import useAnimation from "./use-animation";

import { formatTime } from "@/assets/js/util";
import { PLAY_MODE } from "@/assets/js/constant";
export default {
  name: "Player",
  components: { ProgressBar, Scroll, MiniPlayer },
  setup() {
    const audioRef = ref(null);
    const progressBarRef = ref(null);
    const store = useStore();

    const songReady = ref(false);
    const currentTime = ref(0);
    let progressChanging = false;

    const fullScreen = computed(() => {
      return store.state.fullScreen;
    });

    // ??????????????????
    const currentSong = computed(() => {
      return store.getters.currentSong;
    });

    //computed
    // ?????????????????????
    const playing = computed(() => {
      return store.state.playing;
    });

    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });

    // ????????????????????????
    const currentIndex = computed(() => {
      return store.state.currentIndex;
    });

    const playMode = computed(() => {
      return store.state.playMode;
    });

    // ?????????
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });

    // ????????????js
    const { modeIcon, changeMode } = useMode();

    // ??????
    const { getFavoriteIcon, toggleFavorite } = useFavorite();

    // cd
    const { cdCls, cdRef, cdImageRef } = useCd();

    // ??????
    const {
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playLyric,
      stopLyric,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
    } = useLyric(songReady, currentTime);

    // ??????middle
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useMiddleInteractive();

    // ??????????????????
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } =
      useAnimation();

    // ??????????????????
    const playList = computed(() => store.state.playList);

    // ????????????????????????????????????
    const disableCls = computed(() => {
      return songReady.value ? "" : "disable";
    });

    // ????????????????????????????????????
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      // ?????????????????????, ??????????????????
      currentTime.value = 0;

      songReady.value = false;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });

    // ???????????????????????????
    // 1. ?????? play()
    // 2. ?????? pause()
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        progressBarRef.value.setOffset(progress.value);
      }
    });

    // ?????????????????????????????????
    function goBack() {
      store.commit("setFullScreen", false);
    }

    // ??????????????????
    function togglePlay() {
      store.commit("setPlayingState", !playing.value);
    }
    // ???????????????????????????????????????
    function pause() {
      store.commit("setPlayingState", false);
    }

    // ???????????????
    function prev() {
      const list = playList.value;
      const len = list.length;
      if (!songReady.value || !len) {
        return;
      }
      if (len === 1) {
        loop();
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = len - 1;
        }
        store.commit("setCurrentIndex", index);
      }
    }

    // ???????????????
    function next() {
      const list = playList.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.commit("setCurrentIndex", index);
      }
    }

    // ????????????
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      store.commit("setPlayingState", true);
    }

    // ????????????????????????
    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric();
    }

    // ??????????????????
    function error() {
      songReady.value = true;
    }

    // ???????????????????????????
    function updateTime(e) {
      if (progressChanging) {
        return;
      }
      currentTime.value = e.target.currentTime;
    }

    function onProgressChanging(progress) {
      progressChanging = true;
      currentTime.value = currentSong.value.duration * progress;
      // playLyric ??????currentTime ????????????????????? ?????? ???????????????play
      playLyric();
      stopLyric();
    }
    function onProgressChanged(progress) {
      progressChanging = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }

    // ??????????????????
    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }

    return {
      audioRef,
      fullScreen,
      currentSong,
      playList,
      goBack,
      playIcon,
      togglePlay,
      disableCls,
      pause,
      next,
      prev,
      ready,
      error,
      // ????????????
      modeIcon,
      changeMode,
      end,
      //??????
      getFavoriteIcon,
      toggleFavorite,
      // ?????????
      progress,
      progressBarRef,
      currentTime,
      updateTime,
      formatTime,
      // ???????????????
      onProgressChanging,
      onProgressChanged,
      //cd
      cdCls,
      cdRef,
      cdImageRef,
      // ??????
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      // ??????middle
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // ????????????(????????????)
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
