import type { MoveError } from "./MoveError";

export type MoveResponse =
  | {
      status: "error";
      reason: string;
    }
  | {
      status: "success";
      errors: Array<MoveError>;
    };
