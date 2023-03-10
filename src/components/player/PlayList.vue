<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"> </i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <Scroll class="list-content" ref="scrollRef">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{ disabled: removing }"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </Scroll>
          <!-- <div class="list-add">
            <div class="add">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div> -->
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <Confirm
          ref="confirmRef"
          text="是否清空列表?"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        />
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, ref, nextTick, watch } from "vue";
import { useStore } from "vuex";

import Scroll from "@/components/base/scroll/Scroll.vue";
import Confirm from "@/components/base/confirm/Confirm";

import useMode from "./use-mode";
import useFavorite from "./use-favorite";

export default {
  name: "PlayList",
  components: {
    Scroll,
    Confirm,
  },
  setup() {
    const store = useStore();
    const visible = ref(false);
    const scrollRef = ref(false);
    const listRef = ref(null);
    const removing = ref(false);
    const confirmRef = ref(null);

    const playList = computed(() => store.state.playList);
    const sequenceList = computed(() => store.state.sequenceList);
    const currentSong = computed(() => store.getters.currentSong);

    const { modeIcon, changeMode, modeText } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();

    function hide() {
      visible.value = false;
    }
    async function show() {
      visible.value = true;
      await nextTick();
      refreshScroll();
      scrollToElement();
    }

    watch(currentSong, async (newCurrentSong) => {
      if (!visible.value || !newCurrentSong.id) {
        return;
      }
      await nextTick();
      scrollToElement();
    });

    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return "icon-play";
      }
    }
    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }

    function scrollToElement() {
      const index = sequenceList.value.findIndex((item) => {
        return currentSong.value.id === item.id;
      });
      if (index == -1) {
        return;
      }
      const target = listRef.value.$el.children[index];
      scrollRef.value.scroll.scrollToElement(target, 300);
    }

    function selectItem(song) {
      const index = playList.value.findIndex((item) => {
        return song.id === item.id;
      });
      if (index < 0) {
        return;
      }
      store.commit("setCurrentIndex", index);
    }

    function removeSong(song) {
      if (removing.value) {
        return;
      }
      removing.value = true;
      store.dispatch("removeSong", song);
      if (!playList.value.length) {
        hide();
      }
      setTimeout(() => {
        removing.value = false;
      }, 300);
    }
    // 清空列表
    function showConfirm() {
      confirmRef.value.show();
    }

    function confirmClear() {
      store.dispatch("clearSongList");
      hide();
    }

    return {
      visible,
      playList,
      sequenceList,
      hide,
      show,
      scrollRef,
      getCurrentIcon,
      listRef,
      selectItem,
      removeSong,
      removing,
      // 播放模式
      modeIcon,
      changeMode,
      modeText,
      // 喜欢
      getFavoriteIcon,
      toggleFavorite,
      // 清空列表
      confirmRef,
      showConfirm,
      confirmClear,
    };
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
