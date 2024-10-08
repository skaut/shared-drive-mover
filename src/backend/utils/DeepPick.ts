import type { DeepKeyof } from "./DeepKeyof";

export type DeepPick<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- On purpose, we want to support arbitrary objects
  Obj extends Record<string, any>,
  Keys extends DeepKeyof<Obj>,
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- On purpose, we want to support arbitrary objects
  [K in keyof Obj as Keys[K] extends true | Record<string, any>
    ? K
    : never]: Keys[K] extends true ? Obj[K] : DeepPick<Obj[K], Keys[K]>;
};
