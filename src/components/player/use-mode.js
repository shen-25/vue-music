import { useStore } from "vuex";
import { computed } from "vue";

import { PLAY_MODE } from "@/assets/js/constant";
export default function useMode() {
  const store = useStore();
  const playMode = computed(() => {
    return store.state.playMode;
  });

  // 播放模式icon切换
  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "icon-sequence"
      : playModeVal === PLAY_MODE.random
      ? "icon-random"
      : "icon-loop";
  });

  // 切换播放模式
  function changeMode() {
    const mode = (playMode.value + 1) % 3;
    store.dispatch("changeMode", mode);
  }
  return {
    modeIcon,
    changeMode,
  };
}
