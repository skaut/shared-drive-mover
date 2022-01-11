import { ErrorLogger_ } from "./utils/ErrorLogger";
import { isFolderEmpty_ } from "./move/folderManagement";
import { MoveContext_ } from "./utils/MoveContext";
import { moveFolderContents_ } from "./move/moveFolderContents";

import type { MoveResponse } from "../interfaces/MoveResponse";

export function move(
  sourceID: string,
  destinationID: string,
  moveOnly: boolean,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): MoveResponse {
  if (sourceID === destinationID) {
    return { status: "error", type: "sourceEqualsDestination" };
  }
  let isEmpty: boolean;
  try {
    isEmpty = isFolderEmpty_(destinationID);
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
  if (!notEmptyOverride && !isEmpty) {
    return { status: "error", type: "notEmpty" };
  }
  const logger = new ErrorLogger_();
  moveFolderContents_(
    new MoveContext_(sourceID, destinationID, [], logger),
    moveOnly,
    copyComments,
    mergeFolders
  );
  if (!logger.isEmpty()) {
    console.error(logger.get());
  }
  return { status: "success", response: { errors: logger.get() } };
}
