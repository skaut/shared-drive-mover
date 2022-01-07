import type { MoveError } from "./MoveError";
import type { Response } from "./Response";

export type MoveResponse = Response<
  { errors: Array<MoveError> },
  "DriveAPIError" | "notEmpty"
>;
