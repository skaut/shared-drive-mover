/* exported MoveResponse */

interface MoveResponse {
  status: "error" | "success";
  reason?: string;
  errors?: Array<MoveError>;
}
