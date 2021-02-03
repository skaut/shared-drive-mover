/* exported move */

function isDirectoryEmpty(directoryID: string): boolean {
  const response = Drive.Files!.list({
    includeItemsFromAllDrives: true,
    maxResults: 1,
    q: '"' + directoryID + '" in parents and trashed = false',
    supportsAllDrives: true,
    fields: "items(id)",
  });
  return response.items!.length === 0;
}

function moveFile(
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

function copyFileComments(sourceID: string, destinationID: string): void {
  const comments = [];
  let pageToken = null;
  do {
    const response: GoogleAppsScript.Drive.Schema.CommentList = Drive.Comments!.list(
      sourceID,
      {
        maxResults: 100,
        pageToken: pageToken,
        fields:
          "nextPageToken, items(author(isAuthenticatedUser, displayName), content, status, context, anchor, replies(author(isAuthenticatedUser, displayName), content, verb))",
      }
    );
    for (const comment of response.items!) {
      comments.push(comment);
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  for (const comment of comments) {
    if (!comment.author!.isAuthenticatedUser) {
      comment.content =
        "*" + comment.author!.displayName! + ":*\n" + comment.content!;
    }
    const replies = comment.replies!;
    delete comment.replies;
    const commentId = Drive.Comments!.insert(comment, destinationID).commentId!;
    for (const reply of replies) {
      if (!reply.author!.isAuthenticatedUser) {
        reply.content =
          "*" + reply.author!.displayName! + ":*\n" + reply.content!;
      }
      Drive.Replies!.insert(reply, destinationID, commentId);
    }
  }
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

function moveFolderContentsFiles(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Array<MoveError> {
  const files = [];
  let pageToken = null;
  do {
    const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q:
        '"' +
        sourceID +
        '" in parents and mimeType != "application/vnd.google-apps.folder" and trashed = false',
      pageToken: pageToken,
      maxResults: 1000,
      fields:
        "nextPageToken, items(id, title, capabilities(canMoveItemOutOfDrive))",
    });
    for (const item of response.items!) {
      files.push({
        id: item.id,
        name: item.title,
        canMove: item.capabilities!.canMoveItemOutOfDrive,
      });
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  const errors: Array<MoveError> = [];
  for (const file of files) {
    let error = null;
    if (file.canMove) {
      try {
        moveFile(file.id!, sourceID, destinationID);
      } catch (_) {
        error = moveFileByCopy(
          file.id!,
          file.name!,
          destinationID,
          path,
          copyComments
        );
      }
    } else {
      error = moveFileByCopy(
        file.id!,
        file.name!,
        destinationID,
        path,
        copyComments
      );
    }
    if (error !== null) {
      errors.push(error);
    }
  }
  return errors;
}

function deleteFolderIfEmpty(folderID: string): void {
  const response = Drive.Files!.list({
    maxResults: 1,
    q: '"' + folderID + '" in parents and trashed = false',
    fields: "items(id)",
  });
  if (response.items!.length === 0) {
    const response2 = Drive.Files!.get(folderID, {
      fields: "userPermission(role)",
    });
    if (
      response2.userPermission!.role === "owner" ||
      response2.userPermission!.role === "organizer"
    ) {
      Drive.Files!.remove(folderID);
    }
  }
}

function moveFolderContentsFolders(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Array<MoveError> {
  const folders = [];
  let pageToken = null;
  do {
    const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q:
        '"' +
        sourceID +
        '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
      pageToken: pageToken,
      maxResults: 1000,
      fields: "nextPageToken, items(id, title)",
    });
    for (const item of response.items!) {
      folders.push({ id: item.id, name: item.title });
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  let errors: Array<MoveError> = [];
  for (const folder of folders) {
    try {
      const newFolder = Drive.Files!.insert(
        {
          parents: [{ id: destinationID }],
          title: folder.name,
          mimeType: "application/vnd.google-apps.folder",
        },
        undefined,
        { supportsAllDrives: true, fields: "id" }
      );
      errors = errors.concat(
        moveFolderContents(
          folder.id!,
          newFolder.id!,
          path.concat([folder.name!]),
          copyComments
        )
      );
      deleteFolderIfEmpty(folder.id!);
    } catch (e) {
      errors.push({ file: path.concat([folder.name!]), error: e as string });
    }
  }
  return errors;
}

function moveFolderContents(
  sourceID: string,
  destinationID: string,
  path: Array<string>,
  copyComments: boolean
): Array<MoveError> {
  return moveFolderContentsFiles(
    sourceID,
    destinationID,
    path,
    copyComments
  ).concat(
    moveFolderContentsFolders(sourceID, destinationID, path, copyComments)
  );
}

function move(
  sourceID: string,
  destinationID: string,
  copyComments: boolean,
  notEmptyOverride: boolean
): MoveResponse {
  if (!notEmptyOverride && !isDirectoryEmpty(destinationID)) {
    return { status: "error", reason: "notEmpty" };
  }
  const errors = moveFolderContents(sourceID, destinationID, [], copyComments);
  if (errors.length > 0) {
    console.error(errors);
  }
  return { status: "success", errors };
}
