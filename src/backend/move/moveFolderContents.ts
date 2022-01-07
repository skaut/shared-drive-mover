import {
  deleteFolderIfEmpty_,
  listFilesInFolder_,
  listFoldersInFolder_,
} from "./folderManagement";
import { moveFile_ } from "./moveFile";
import { resolveDestinationFolder_ } from "./resolveDestinationFolder";

import type { MoveContext_ } from "../utils/MoveContext";

async function moveFolderContentsFiles_(
  context: MoveContext_,
  copyComments: boolean
): Promise<void> {
  const files = await context.tryAndLog(async () =>
    listFilesInFolder_(context.sourceID)
  );
  if (files === null) {
    return;
  }
  for (const file of files) {
    await moveFile_(file, context, copyComments);
  }
}

async function moveFolderContentsFolders_(
  context: MoveContext_,
  copyComments: boolean,
  mergeFolders: boolean
): Promise<void> {
  const subFolders = await context.tryAndLog(async () =>
    listFoldersInFolder_(context.sourceID)
  );
  if (subFolders === null) {
    return;
  }
  for (const folder of subFolders) {
    await context.tryAndLog(async () => {
      const destinationFolder = await resolveDestinationFolder_(
        folder,
        context,
        mergeFolders
      );
      await moveFolderContents_(
        context.childContext(folder.id!, destinationFolder.id!, folder.title!),
        copyComments,
        mergeFolders
      );
      await deleteFolderIfEmpty_(folder.id!);
    }, folder.title);
  }
}

export async function moveFolderContents_(
  context: MoveContext_,
  copyComments: boolean,
  mergeFolders: boolean
): Promise<void> {
  await moveFolderContentsFiles_(context, copyComments);
  await moveFolderContentsFolders_(context, copyComments, mergeFolders);
}
