import { copyFileComments_ } from "./copyFileComments";

import type { ErrorLogger_ } from "../utils/ErrorLogger";
import type { MoveContext } from "../../interfaces/MoveContext";

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
  context: MoveContext,
  logger: ErrorLogger_,
  copyComments: boolean
): void {
  logger.tryOrLog(
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
  context: MoveContext,
  logger: ErrorLogger_,
  copyComments: boolean
): void {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    try {
      moveFileDirectly_(file.id!, context);
      return;
    } catch (e) {} // eslint-disable-line no-empty
  }
  moveFileByCopy_(file.id!, file.title!, context, logger, copyComments);
}
