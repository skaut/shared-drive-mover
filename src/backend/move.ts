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
  const errors = moveFolderContents_(
    sourceID,
    destinationID,
    [],
    copyComments,
    mergeFolders
  );
  if (errors.length > 0) {
    console.error(errors);
  }
  return { status: "success", errors };
}
