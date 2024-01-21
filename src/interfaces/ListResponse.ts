import type { NamedRecord } from "./NamedRecord";
import type { Response } from "./Response";

export type ListResponse = Response<
  Array<NamedRecord>,
  "DriveAPIError" | "invalidParameter"
>;
