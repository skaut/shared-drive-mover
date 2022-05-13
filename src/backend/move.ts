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
  if (sourceID === destinationID) {
    return { status: "error", type: "sourceEqualsDestination" };
  }
  let isEmpty: boolean;
  try {
    isEmpty = isFolderEmpty_(destinationID);
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }

  const state = new MoveState_(
    sourceID,
    destinationID,
    copyComments,
    mergeFolders
  );
  state.loadState();

  if (!notEmptyOverride && !isEmpty && state.isNull()) {
    return { status: "error", type: "notEmpty" };
  }

  if (state.isNull()) {
    state.addPath(sourceID, destinationID, []);
  }
  state.saveState();

  const logger = new ErrorLogger_();
  logger.set(state.getErrors());
  moveFolderContents_(
    new MoveContext_(sourceID, destinationID, [], logger),
    copyComments,
    mergeFolders
  );
  if (!logger.isEmpty()) {
    console.error(logger.get());
  }
  state.destroyState();
  return { status: "success", response: { errors: logger.get() } };
}
