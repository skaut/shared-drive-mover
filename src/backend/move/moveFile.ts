import { copyFileComments_ } from "./copyFileComments";

import type { MoveContext_ } from "../utils/MoveContext";

function moveFileDirectly_(fileID: string, context: MoveContext_): void {
  Drive.Files!.update({}, fileID, null, {
    addParents: context.destinationID,
    removeParents: context.sourceID,
    supportsAllDrives: true,
    fields: "",
  });
}

function moveFileByCopy_(
  fileID: string,
  name: string,
  context: MoveContext_,
  copyComments: boolean
): void {
  context.tryAndLog(() => {
    const copy = Drive.Files!.copy(
      {
        parents: [{ id: context.destinationID }],
        title: name,
      },
      fileID,
      { supportsAllDrives: true, fields: "id" }
    );
    if (copyComments) {
      copyFileComments_(fileID, copy.id!);
    }
  }, name);
}

export function moveFile_(
  file: GoogleAppsScript.Drive.Schema.File,
  context: MoveContext_,
  copyComments: boolean
): void {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    try {
      moveFileDirectly_(file.id!, context);
      return;
    } catch (e) {} // eslint-disable-line no-empty
  }
  moveFileByCopy_(file.id!, file.title!, context, copyComments);
}
