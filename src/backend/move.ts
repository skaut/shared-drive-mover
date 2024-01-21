import type { MoveResponse } from "../interfaces/MoveResponse";
import { isFolderEmpty_ } from "./move/folderManagement";
import { moveFolder_ } from "./move/moveFolder";
import { MoveState_ } from "./utils/MoveState";

export function move(
  sourceID: google.script.Parameter,
  destinationID: google.script.Parameter,
  copyComments: google.script.Parameter,
  mergeFolders: google.script.Parameter,
  notEmptyOverride: google.script.Parameter,
): MoveResponse {
  if (
    typeof sourceID !== "string" ||
    typeof destinationID !== "string" ||
    typeof copyComments !== "boolean" ||
    typeof mergeFolders !== "boolean" ||
    typeof notEmptyOverride !== "boolean"
  ) {
    return { status: "error", type: "invalidParameter" };
  }
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
    mergeFolders,
  );
  state.loadState();

  if (!notEmptyOverride && !isEmpty && state.isNull()) {
    return { status: "error", type: "notEmpty" };
  }

  if (state.isNull()) {
    state.addPath(sourceID, destinationID, []);
  }
  state.saveState();

  for (;;) {
    const nextPath = state.getNextPath();
    if (nextPath === null) {
      break;
    }
    moveFolder_(state, nextPath, copyComments, mergeFolders);
  }

  const errors = state.getErrors();
  if (errors.length > 0) {
    console.error(errors);
  }
  state.destroyState();
  return { status: "success", response: { errors: errors } };
}
