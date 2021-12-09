import { ErrorLogger_ } from "./utils/ErrorLogger";
import { isFolderEmpty_ } from "./move/folderManagement";
import { MoveContext_ } from "./utils/MoveContext";
import { moveFolderContents_ } from "./move/moveFolderContents";

import type { MoveResponse } from "../interfaces/MoveResponse";

export function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): MoveResponse {
  let isEmpty: boolean;
  try {
    isEmpty = isFolderEmpty_(destinationID);
  } catch (e) {
    return { status: "error", reason: "DriveAPIError" };
  }
  if (!notEmptyOverride && !isEmpty) {
    return { status: "error", reason: "notEmpty" };
  }
  const logger = new ErrorLogger_();
  moveFolderContents_(
    new MoveContext_(sourceID, destinationID, [], logger),
    copyComments,
    mergeFolders
  );
  if (!logger.isEmpty()) {
    console.error(logger.get());
  }
  return { status: "success", errors: logger.get() };
}
