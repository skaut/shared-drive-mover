import { copyFileComments } from "./copyFileComments";

import type { GoogleJsonResponseException } from "../../interfaces/GoogleJsonResponseException";
import type { MoveError } from "../../interfaces/MoveError";

function moveFileDirectly(
  fileID: string,
  sourceID: string,
  destinationID: string
): void {
  Drive.Files!.update({}, fileID, null, {
    addParents: destinationID,
    removeParents: sourceID,
    supportsAllDrives: true,
    fields: "",
  });
}

function moveFileByCopy(
  fileID: string,
  name: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): MoveError | null {
  try {
    const copy = Drive.Files!.copy(
      {
        parents: [{ id: destinationID }],
        title: name,
      },
      fileID,
      { supportsAllDrives: true, fields: "id" }
    );
    if (copyComments) {
      copyFileComments(fileID, copy.id!);
    }
    return null;
  } catch (e) {
    return {
      file: path.concat([name]),
      error: (e as GoogleJsonResponseException).message,
    };
  }
}

export function moveFile(
  file: GoogleAppsScript.Drive.Schema.File,
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): MoveError | null {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    try {
      moveFileDirectly(file.id!, sourceID, destinationID);
      return null;
    } catch (e) {
      return moveFileByCopy(
        file.id!,
        file.title!,
        destinationID,
        path,
        copyComments
      );
    }
  } else {
    return moveFileByCopy(
      file.id!,
      file.title!,
      destinationID,
      path,
      copyComments
    );
  }
}
