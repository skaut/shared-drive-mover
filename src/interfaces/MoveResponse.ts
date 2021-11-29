import type { MoveError } from "./MoveError";

export interface MoveResponse {
  status: "error" | "success";
  reason?: string;
  errors?: Array<MoveError>;
}
