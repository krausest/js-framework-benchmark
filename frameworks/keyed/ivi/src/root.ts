// Basic Scheduler implementation for the benchmark to disable microtask batching.
// https://github.com/localvoid/ivi#custom-scheduler

import { dirtyCheck, SNode, SRoot, VAny } from "ivi";
import { Flags, RENDER_CONTEXT, createSNode, mount, update } from "ivi";

export const createRoot = (p: Element): SRoot<null> => (
  createSNode(
    Flags.Root,
    {
      d: {
        f: Flags.Root,
        p1: (root: SRoot) => {
          dirtyCheck(root.c as SNode, 0);
          root.f = Flags.Root;
        },
        p2: null,
      },
      p: { p, n: null },
    },
    null,
    null,
    null,
  )
);

export const updateRoot = (root: SRoot<null>, v: VAny): void => {
  const domSlot = root.v.p;
  RENDER_CONTEXT.p = domSlot.p;
  RENDER_CONTEXT.n = domSlot.n;
  root.c = (
    (root.c === null)
      ? mount(root, v)
      : update(root, root.c as SNode, v, 0)
  );
};
