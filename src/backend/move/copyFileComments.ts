import type { DeepPick } from "../utils/DeepPick";
import type {
  SafeComment,
  SafeCommentList,
  SafeDriveService_,
} from "../utils/SafeDriveService";

import { paginationHelper_ } from "../utils/paginationHelper";

interface CommentKeys {
  anchor: true;
  author: {
    displayName: true;
    me: true;
  };
  content: true;
  quotedFileContent: true;
  replies: true;
  resolved: true;
}

export function copyFileComments_(
  sourceID: string,
  destinationID: string,
  driveService: SafeDriveService_,
): void {
  const comments = listFileComments_(sourceID, driveService);
  for (const comment of comments) {
    if (!comment.author.me) {
      comment.content = `*${comment.author.displayName}:*\n${comment.content}`;
    }
    const replies = comment.replies;
    comment.replies = [];
    const commentId = driveService.Comments.create(comment, destinationID, {
      id: true,
    }).id;
    for (const reply of replies) {
      if (!reply.author.me) {
        reply.content = `*${reply.author.displayName}:*\n${reply.content}`;
      }
      driveService.Replies.create(reply, destinationID, commentId, {
        fields: "id",
      });
    }
  }
}

function listFileComments_(
  fileID: string,
  driveService: SafeDriveService_,
): Array<DeepPick<SafeComment, CommentKeys>> {
  return paginationHelper_<
    SafeCommentList<CommentKeys>,
    DeepPick<SafeComment, CommentKeys>
  >(
    (pageToken) =>
      driveService.Comments.list(
        fileID,
        {
          anchor: true,
          author: {
            displayName: true,
            me: true,
          },
          content: true,
          quotedFileContent: true,
          replies: true,
          resolved: true,
        },
        {
          maxResults: 100,
          pageToken,
        },
      ),
    (response) => response.comments,
  );
}
