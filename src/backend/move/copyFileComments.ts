import { paginationHelper } from "../paginationHelper";

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

export function copyFileComments(
  sourceID: string,
  destinationID: string
): void {
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
