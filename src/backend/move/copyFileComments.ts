import type {
  DriveService_,
  SafeComment,
  SafeCommentList,
} from "../utils/DriveService";

import { paginationHelper_ } from "../utils/paginationHelper";

function listFileComments_(
  fileID: string,
  driveService: DriveService_,
): Array<SafeComment> {
  return paginationHelper_<SafeCommentList, SafeComment>(
    (pageToken) =>
      driveService.Comments.list(fileID, {
        fields:
          "nextPageToken, items(author(isAuthenticatedUser, displayName), content, status, context, anchor, replies(author(isAuthenticatedUser, displayName), content, verb))",
        maxResults: 100,
        pageToken,
      }),
    (response) => response.items,
  );
}

export function copyFileComments_(
  sourceID: string,
  destinationID: string,
  driveService: DriveService_,
): void {
  const comments = listFileComments_(sourceID, driveService);
  for (const comment of comments) {
    if (!comment.author.isAuthenticatedUser) {
      comment.content = `*${comment.author.displayName}:*\n${comment.content}`;
    }
    const replies = comment.replies;
    comment.replies = [];
    const commentId = driveService.Comments.insert(
      comment,
      destinationID,
    ).commentId;
    for (const reply of replies) {
      if (!reply.author.isAuthenticatedUser) {
        reply.content = `*${reply.author.displayName}:*\n${reply.content}`;
      }
      driveService.Replies.insert(reply, destinationID, commentId);
    }
  }
}
