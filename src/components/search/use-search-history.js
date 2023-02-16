import { save, remove, clear } from "@/assets/js/array-store";
import { SEARCH_KEY } from "@/assets/js/constant";
import store from "@/store";

export default function useSearchHistory() {
  const maxLen = 100;

  function saveSearch(query) {
    const searchList = save(
      query,
      SEARCH_KEY,
      (item) => {
        return item === query;
      },
      maxLen
    );
    store.commit("setSearchHistory", searchList);
  }
  function deleteSearch(query) {
    const searches = remove(SEARCH_KEY, (item) => {
      return query === item;
    });
    store.commit("setSearchHistory", searches);
  }
  function clearSearch() {
    const searches = clear(SEARCH_KEY);
    store.commit("setSearchHistory", searches);
  }

  return { saveSearch, deleteSearch, clearSearch };
}
