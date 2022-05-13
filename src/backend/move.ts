import { ErrorLogger_ } from "./utils/ErrorLogger";
import { isFolderEmpty_ } from "./move/folderManagement";
import { moveFolder_ } from "./move/moveFolderContents";
import { MoveState_ } from "./utils/MoveState";

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
  while (true) {
    const nextPath = state.getNextPath();
    if (nextPath === null) {
      break;
    }
    moveFolder_(state, nextPath, logger, copyComments, mergeFolders)
  }

  if (!logger.isEmpty()) {
    console.error(logger.get());
  }
  state.destroyState();
  return { status: "success", response: { errors: logger.get() } };
}
