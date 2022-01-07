import { backoffHelper_ } from "../utils/backoffHelper";
import { copyFileComments_ } from "./copyFileComments";

import type { MoveContext_ } from "../utils/MoveContext";

async function moveFileDirectly_(
  fileID: string,
  context: MoveContext_
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  await backoffHelper_<void>(() =>
    Drive.Files!.update({}, fileID, null, {
      addParents: context.destinationID,
      removeParents: context.sourceID,
      supportsAllDrives: true,
      fields: "",
    })
  );
}

async function moveFileByCopy_(
  fileID: string,
  name: string,
  context: MoveContext_,
  copyComments: boolean
): Promise<void> {
  await context.tryAndLog(async () => {
    const copy = await backoffHelper_<GoogleAppsScript.Drive.Schema.File>(() =>
      Drive.Files!.copy(
        {
          parents: [{ id: context.destinationID }],
          title: name,
        },
        fileID,
        { supportsAllDrives: true, fields: "id" }
      )
    );
    if (copyComments) {
      await copyFileComments_(fileID, copy.id!);
    }
  }, name);
}

export async function moveFile_(
  file: GoogleAppsScript.Drive.Schema.File,
  context: MoveContext_,
  copyComments: boolean
): Promise<void> {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    try {
      await moveFileDirectly_(file.id!, context);
      return;
    } catch (e) {} // eslint-disable-line no-empty
  }
  await moveFileByCopy_(file.id!, file.title!, context, copyComments);
}
