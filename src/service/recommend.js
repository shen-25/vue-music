import { get } from "./base";

function getRecommend() {
  return get("/api/getRecommend");
}

export { getRecommend };
