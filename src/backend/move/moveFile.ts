/* exported moveFile */

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

function listFileComments(
  fileID: string
): Array<GoogleAppsScript.Drive.Schema.Comment> {
  return paginationHelper<
    GoogleAppsScript.Drive.Schema.CommentList,
    GoogleAppsScript.Drive.Schema.Comment
  >(
    (pageToken) =>
      Drive.Comments!.list(fileID, {
        maxResults: 100,
        pageToken: pageToken,
        fields:
          "nextPageToken, items(author(isAuthenticatedUser, displayName), content, status, context, anchor, replies(author(isAuthenticatedUser, displayName), content, verb))",
      }),
    (response) => response.items!
  );
}

function copyFileComments(sourceID: string, destinationID: string): void {
  const comments = listFileComments(sourceID);
  for (const comment of comments) {
    if (!comment.author!.isAuthenticatedUser!) {
      comment.content =
        "*" + comment.author!.displayName! + ":*\n" + comment.content!;
    }
    const replies = comment.replies!;
    delete comment.replies;
    const commentId = Drive.Comments!.insert(comment, destinationID).commentId!;
    for (const reply of replies) {
      if (!reply.author!.isAuthenticatedUser!) {
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

function moveFile(
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
