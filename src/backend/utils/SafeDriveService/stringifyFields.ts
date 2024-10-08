import type { DeepKeyof } from "../DeepKeyof";

export function stringifyFields_(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- On purpose, we want to support arbitrary objects
  fields: DeepKeyof<Record<string, any>>,
): string {
  const ret: Array<string> = [];
  for (const key in fields) {
    if (!Object.prototype.hasOwnProperty.call(fields, key)) {
      continue;
    }
    const val = fields[key];
    if (typeof val === "object") {
      ret.push(`${key}(${stringifyFields_(val)})`);
    } else if (val === true) {
      ret.push(key);
    }
  }
  return ret.join(", ");
}
