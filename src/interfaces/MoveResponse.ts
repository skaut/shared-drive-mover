/* exported MoveResponse */

interface MoveResponse {
  status: "success" | "error";
  reason?: string;
  errors?: MoveErrors;
}
