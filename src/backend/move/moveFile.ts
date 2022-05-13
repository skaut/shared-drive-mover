import { copyFileComments_ } from "./copyFileComments";

import type { MoveContext } from "../../interfaces/MoveContext";
import type { MoveState_ } from "../utils/MoveState";

function moveFileDirectly_(fileID: string, context: MoveContext): void {
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
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean
): void {
  state.tryOrLog(
    context,
    () => {
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
    },
    name
  );
}

export function moveFile_(
  file: GoogleAppsScript.Drive.Schema.File,
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean
): void {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    try {
      moveFileDirectly_(file.id!, context);
      return;
    } catch (e) {} // eslint-disable-line no-empty
  }
  moveFileByCopy_(file.id!, file.title!, state, context, copyComments);
}
