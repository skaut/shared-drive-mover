import { backoffHelper_ } from "../utils/backoffHelper";
import { copyFileComments_ } from "./copyFileComments";

import type { ErrorLogger_ } from "../utils/ErrorLogger";
import type { GoogleJsonResponseException } from "../../interfaces/GoogleJsonResponseException";

async function moveFileDirectly_(
  fileID: string,
  sourceID: string,
  destinationID: string
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  await backoffHelper_<void>(() =>
    Drive.Files!.update({}, fileID, null, {
      addParents: destinationID,
      removeParents: sourceID,
      supportsAllDrives: true,
      fields: "",
    })
  );
}

async function moveFileByCopy_(
  fileID: string,
  name: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  logger: ErrorLogger_
): Promise<void> {
  await backoffHelper_<GoogleAppsScript.Drive.Schema.File>(() =>
    Drive.Files!.copy(
      {
        parents: [{ id: destinationID }],
        title: name,
      },
      fileID,
      { supportsAllDrives: true, fields: "id" }
    )
  )
    .then(async (copy) => {
      if (copyComments) {
        await copyFileComments_(fileID, copy.id!);
      }
    })
    .catch((e) => {
      logger.log(
        path.concat([name]),
        (e as GoogleJsonResponseException).message
      );
    });
}

export async function moveFile_(
  file: GoogleAppsScript.Drive.Schema.File,
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  logger: ErrorLogger_
): Promise<void> {
  if (file.capabilities!.canMoveItemOutOfDrive!) {
    await moveFileDirectly_(file.id!, sourceID, destinationID).catch(
      async () => {
        await moveFileByCopy_(
          file.id!,
          file.title!,
          destinationID,
          path,
          copyComments,
          logger
        );
      }
    );
  } else {
    await moveFileByCopy_(
      file.id!,
      file.title!,
      destinationID,
      path,
      copyComments,
      logger
    );
  }
}
