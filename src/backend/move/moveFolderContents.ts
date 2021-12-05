import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { ErrorLogger_ } from "../utils/ErrorLogger";

async function moveFolderContentsFiles_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  logger: ErrorLogger_
): Promise<void> {
  for (const file of await listFilesInFolder_(sourceID)) {
    await moveFile_(file, sourceID, destinationID, path, copyComments, logger);
  }
}

async function moveFolderContentsFolders_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean,
  logger: ErrorLogger_
): Promise<void> {
  for (const folder of await listFoldersInFolder_(sourceID)) {
    await resolveDestinationFolder_(
      folder,
      destinationID,
      path,
      mergeFolders,
      logger
    )
      .then(async (destinationFolder) => {
        await moveFolderContents_(
          folder.id!,
          destinationFolder.id!,
          path.concat([folder.title!]),
          copyComments,
          mergeFolders,
          logger
        );
        await deleteFolderIfEmpty_(folder.id!).catch((e) => {
          logger.log(path.concat([folder.title!]), (e as Error).message);
        });
      })
      .catch((e) => {
        logger.log(path.concat([folder.title!]), (e as Error).message);
      });
  }
}

export async function moveFolderContents_(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean,
  mergeFolders: boolean,
  logger: ErrorLogger_
): Promise<void> {
  await moveFolderContentsFiles_(
    sourceID,
    destinationID,
    path,
    copyComments,
    logger
  );
  await moveFolderContentsFolders_(
    sourceID,
    destinationID,
    path,
    copyComments,
    mergeFolders,
    logger
  );
}
