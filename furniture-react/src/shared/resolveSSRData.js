// resolveSSRData.js
import { ssrConfig } from "./ssrConfig";

export const resolveSSRData = async (req, store, fetchSSR) => {
  const loaders = ssrConfig
    .filter(route => route.match(req.url))
    .map(route => route.load(store, fetchSSR, req.url));

  //await Promise.all(loaders);
  const results = await Promise.all(loaders);

  for (const r of results) {
    if (r?.error === "unauthorized") {
      return { redirect: "/login" };
    }
    if (r?.error === "forbidden") {
      return { redirect: "/403" };
    }
  }

  return { ok: true };
};