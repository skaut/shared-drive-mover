import { ErrorLogger_ } from "./utils/ErrorLogger";
import { isFolderEmpty_ } from "./move/folderManagement";
import { MoveContext_ } from "./utils/MoveContext";
import { moveFolderContents_ } from "./move/moveFolderContents";

import type { MoveResponse } from "../interfaces/MoveResponse";

export async function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  mergeFolders: boolean,
  notEmptyOverride: boolean
): Promise<MoveResponse> {
  let isEmpty: boolean;
  try {
    isEmpty = await isFolderEmpty_(destinationID);
  } catch (e) {
    return { status: "error", type: "DriveAPIError" };
  }
  if (!notEmptyOverride && !isEmpty) {
    return { status: "error", type: "notEmpty" };
  }
  const logger = new ErrorLogger_();
  await moveFolderContents_(
    new MoveContext_(sourceID, destinationID, [], logger),
    copyComments,
    mergeFolders
  );
  if (!logger.isEmpty()) {
    console.error(logger.get());
  }
  return { status: "success", response: { errors: logger.get() } };
}
