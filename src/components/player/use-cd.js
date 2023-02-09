import { useStore } from "vuex";
import { computed, ref, watch } from "vue";

export default function useCd() {
  const store = useStore();

  const cdRef = ref(null);
  const cdImageRef = ref(null);

  const playing = computed(() => {
    return store.state.playing;
  });

  const cdCls = computed(() => {
    return playing.value ? "playing" : "";
  });

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      synTransform(cdRef.value, cdImageRef.value);
    }
  });

  function synTransform(wrapper, inner) {
    // 获取内层的transform
    const innerTransform = getComputedStyle(inner).transform;

    const wrapperTransform = getComputedStyle(wrapper).transform;

    console.log(wrapperTransform);
    // 外层第二次时有角度了
    // 二者角度需要叠加
    wrapper.style.transform =
      wrapperTransform === "none"
        ? innerTransform
        : innerTransform.concat("", wrapperTransform);
  }

  return {
    cdCls,
    cdRef,
    cdImageRef,
  };
}
