// eslint-disable-next-line @typescript-eslint/no-explicit-any -- On purpose, we want to support arbitrary objects
export type DeepKeyof<T extends Record<string, any>> = {
  [K in keyof T]?: true | DeepKeyof<T[K]>;
};
