import { paginationHelper_ } from "../utils/paginationHelper";

function listFileComments_(
  fileID: string,
): Array<GoogleAppsScript.Drive.Schema.Comment> {
  return paginationHelper_<
    GoogleAppsScript.Drive.Schema.CommentList,
    GoogleAppsScript.Drive.Schema.Comment
  >(
    (pageToken) =>
      Drive.Comments!.list(fileID, {
        fields:
          "nextPageToken, items(author(isAuthenticatedUser, displayName), content, status, context, anchor, replies(author(isAuthenticatedUser, displayName), content, verb))",
        maxResults: 100,
        pageToken: pageToken,
      }),
    (response) => response.items!,
  );
}

export function copyFileComments_(
  sourceID: string,
  destinationID: string,
): void {
  const comments = listFileComments_(sourceID);
  for (const comment of comments) {
    if (comment.author?.isAuthenticatedUser !== true) {
      comment.content =
        `*${comment.author!.displayName!}:*\n${comment.content!}`;
    }
    const replies = comment.replies!;
    delete comment.replies;
    const commentId = Drive.Comments!.insert(comment, destinationID).commentId!;
    for (const reply of replies) {
      if (reply.author?.isAuthenticatedUser !== true) {
        reply.content =
          `*${reply.author!.displayName!}:*\n${reply.content!}`;
      }
      Drive.Replies!.insert(reply, destinationID, commentId);
    }
  }
}
