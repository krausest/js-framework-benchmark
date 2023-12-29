import { VNode, withMemo } from "vue";

export default function useMemo() {
  const cache = [];

  let i = -1;

  return (memo = () => []) => {
    i += 1;

    const render = (index, toRender) => {
      const r = withMemo(memo(), () => toRender, cache, index);

      if (cache.indexOf(r) !== index) {
        console.error("withMemo cache has been corrupted");
      }

      return r;
    };

    return render.bind(null, i);
  };
}
