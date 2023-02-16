import { useStore } from "vuex";
import { computed, watch, ref } from "vue";

import Lyric from "lyric-parser";

import { getLyric } from "@/service/song";

import lyricJson from "@/cache/修炼爱情lyric.json";

export default function useLyric(songReady, currentTime) {
  const store = useStore();

  const currentLyric = ref(null);
  const currentLineNum = ref(0);
  const pureMusicLyric = ref(0);

  const lyricScrollRef = ref(null);
  const lyricListRef = ref(null);
  const playingLyric = ref(null);

  const currentSong = computed(() => {
    return store.getters.currentSong;
  });

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return;
    }

    stopLyric();
    currentLyric.value = null;
    currentLineNum.value = 0;
    pureMusicLyric.value = "";
    playingLyric.value = "";
    // const lyric = await getLyric(newSong);
    const lyric = lyricJson.result.lyric;
    // 键值对 song:newSong  newSong: newSong
    // 全局状态，编辑器按保存后会消失
    // 处理下一首歌
    store.commit("addSongLyric", { song: newSong, lyric });
    if (currentSong.value.lyric !== lyric) {
      return;
    }

    currentLyric.value = new Lyric(lyric, handleLyric);
    const hasLyric = currentLyric.value.lines.length;
    if (hasLyric) {
      if (songReady.value) {
        playLyric();
      }
    } else {
      pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, "");
    }
  });
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    const scrollComp = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    if (!listEl) {
      return;
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5];
      scrollComp.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollComp.scroll.scrollToElement(0, 0, 1000);
    }
  }

  function playLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000);
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.stop();
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playLyric,
    stopLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
  };
}
