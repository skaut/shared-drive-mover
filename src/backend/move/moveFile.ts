import type { MoveContext } from "../../interfaces/MoveContext";
import type { MoveState_ } from "../utils/MoveState";
import type { SafeDriveService_ } from "../utils/SafeDriveService";

import { copyFileComments_ } from "./copyFileComments";

function moveFileDirectly_(
  fileID: string,
  context: MoveContext,
  driveService: SafeDriveService_,
): void {
  driveService.Files.update({}, fileID, null, {
    addParents: context.destinationID,
    fields: "",
    removeParents: context.sourceID,
    supportsAllDrives: true,
  });
}

function moveFileByCopy_(
  fileID: string,
  name: string,
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean,
  driveService: SafeDriveService_,
): void {
  state.tryOrLog(
    context,
    () => {
      const copy = driveService.Files.copy(
        {
          parents: [{ id: context.destinationID }],
          title: name,
        },
        fileID,
        { fields: "id", supportsAllDrives: true },
      );
      if (copyComments) {
        copyFileComments_(fileID, copy.id!, driveService);
      }
    },
    name,
  );
}

export function moveFile_(
  file: GoogleAppsScript.Drive.Schema.File,
  state: MoveState_,
  context: MoveContext,
  copyComments: boolean,
  driveService: SafeDriveService_,
): void {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    try {
      moveFileDirectly_(file.id!, context, driveService);
      return;
    } catch (e) {} // eslint-disable-line no-empty -- Handled by moving by copying
  }
  moveFileByCopy_(
    file.id!,
    file.title!,
    state,
    context,
    copyComments,
    driveService,
  );
}
