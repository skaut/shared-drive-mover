import type { DeepKeyof } from "../DeepKeyof";
import type { DeepPick } from "../DeepPick";

import { stringifyFields_ } from "./stringifyFields";

export interface SafeComment {
  anchor: string;
  author: SafeUser;
  content: string;
  id: string;
  quotedFileContent: {
    mimeType: string;
    value: string;
  };
  replies: Array<SafeReply>;
  resolved: boolean;
}

export interface SafeCommentList<F extends DeepKeyof<SafeComment>> {
  comments: Array<DeepPick<SafeComment, F>>;
  nextPageToken?: string | undefined;
}

interface SafeReply {
  author: SafeUser;
  content: string;
}

interface SafeUser {
  displayName: string;
  me: boolean;
}

function commentIsSafe_<F extends DeepKeyof<SafeComment>>(
  comment: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
  keys: F,
): comment is DeepPick<SafeComment, F> {
  return (
    (keys.author !== true ||
      (comment.author !== undefined && userIsSafe_(comment.author))) &&
    (keys.id !== true || comment.id !== undefined) &&
    (keys.content !== true || comment.content !== undefined) &&
    (keys.replies !== true ||
      comment.replies?.every((reply) => commentReplyIsSafe_(reply)) === true)
  );
}

function commentListIsSafe_<F extends DeepKeyof<SafeComment>>(
  commentList: GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentList,
  keys: F,
): commentList is SafeCommentList<F> {
  return (
    commentList.comments?.every((comment) => commentIsSafe_(comment, keys)) ===
    true
  );
}

function commentReplyIsSafe_(
  commentReply: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply,
): commentReply is SafeReply {
  return (
    commentReply.author !== undefined &&
    userIsSafe_(commentReply.author) &&
    commentReply.content !== undefined
  );
}

function userIsSafe_(
  user: GoogleAppsScript.Drive_v3.Drive.V3.Schema.User,
): user is SafeUser {
  return user.me !== undefined && user.displayName !== undefined;
}

export const SafeCommentsCollection_ = {
  create: <F extends DeepKeyof<SafeComment>>(
    resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
    fileId: string,
    fields: F,
  ): DeepPick<SafeComment, F> => {
    const ret = Drive.Comments.create(resource, fileId, {
      fields: stringifyFields_(fields),
    });
    if (!commentIsSafe_(ret, fields)) {
      throw new Error("Comments.create: Comment is not safe.");
    }
    return ret;
  },

  list: <F extends DeepKeyof<SafeComment>>(
    fileId: string,
    fields: F,
    optionalArgs: {
      maxResults?: number;
      pageToken?: string | undefined;
    } = {},
  ): SafeCommentList<F> => {
    const ret = Drive.Comments.list(fileId, {
      ...optionalArgs,
      fields: `nextPageToken, comments(${stringifyFields_(fields)})`,
    });
    if (!commentListIsSafe_(ret, fields)) {
      throw new Error("Comments.list: Comment list is not safe.");
    }
    return ret;
  },
};
