import type { MoveResponse } from "../interfaces/MoveResponse";

import { isFolderEmpty_ } from "./move/folderManagement";
import { moveFolder_ } from "./move/moveFolder";
import { MoveState_ } from "./utils/MoveState";
import { SafeDriveService_ } from "./utils/SafeDriveService";

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

  try {
    const driveService = new SafeDriveService_();

    const isEmpty = isFolderEmpty_(destinationID, driveService);

    const state = new MoveState_(
      sourceID,
      destinationID,
      copyComments,
      mergeFolders,
      driveService,
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
      moveFolder_(state, nextPath, copyComments, mergeFolders, driveService);
    }

    const errors = state.getErrors();
    if (errors.length > 0) {
      // eslint-disable-next-line no-console -- Intentional error printing
      console.error(errors);
    }
    state.destroyState();
    return { response: { errors }, status: "success" };
  } catch (e: unknown) {
    return {
      detail:
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof e.message === "string"
          ? e.message
          : undefined,
      status: "error",
      type: "DriveAPIError",
    };
  }
}
