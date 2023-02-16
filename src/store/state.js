import { PLAY_MODE } from "@/assets/js/constant";

import { load } from "@/assets/js/array-store";
import { FAVORITE_KEY, SEARCH_KEY } from "@/assets/js/constant";
const state = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: load(FAVORITE_KEY),
  searchHistory: load(SEARCH_KEY),
};

export default state;
