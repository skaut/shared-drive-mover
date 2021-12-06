import { ErrorLogger_ } from "./utils/ErrorLogger";
import { isFolderEmpty_ } from "./move/folderManagement";
import { moveFolderContents_ } from "./move/moveFolderContents";

import type { MoveResponse } from "../interfaces/MoveResponse";

export function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): MoveResponse {
  const isEmpty = isFolderEmpty_(destinationID);
  if (!notEmptyOverride && !isEmpty) {
    return { status: "error", reason: "notEmpty" };
  }
  const logger = new ErrorLogger_();
  moveFolderContents_(
    { sourceID, destinationID, path: [] },
    copyComments,
    mergeFolders,
    logger
  );
  if (!logger.isEmpty()) {
    console.error(logger.get());
  }
  return { status: "success", errors: logger.get() };
}
