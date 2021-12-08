import { ErrorLogger_ } from "../backend/utils/ErrorLogger";

export interface MoveContext {
  sourceID: string;
  destinationID: string;
  path: Array<string>;
  logger: ErrorLogger_;
}
