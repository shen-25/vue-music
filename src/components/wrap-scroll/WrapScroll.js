import {
  h,
  mergeProps,
  renderSlot,
  withCtx,
  ref,
  computed,
  watch,
  nextTick,
} from "vue";
import Scroll from "@/components/base/scroll/Scroll";
import { useStore } from "vuex";
export default {
  name: "wrapScroll",
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: "scrollRef" }, ctx.$props, {
        onScroll: (e) => {
          ctx.$emit("scroll", e);
        },
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    const store = useStore();
    const scrollRef = ref(null);
    const playList = computed(() => {
      return store.state.playList;
    });

    const scroll = computed(() => scrollRef.value.scroll);
    watch(playList, async (newPlayList) => {
      await nextTick();
      scrollRef.value.scroll.refresh();
    });
    return {
      scrollRef,
      scroll,
    };
  },
};
