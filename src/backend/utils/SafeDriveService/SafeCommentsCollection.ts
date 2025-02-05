export interface SafeComment {
  author: SafeUser;
  content: string;
  id: string;
  replies: Array<SafeReply>;
}

export interface SafeCommentList {
  comments: Array<SafeComment>;
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

function commentIsSafe_(
  comment: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
): comment is SafeComment {
  return (
    comment.author !== undefined &&
    userIsSafe_(comment.author) &&
    comment.id !== undefined &&
    comment.content !== undefined &&
    comment.replies?.every((reply) => commentReplyIsSafe_(reply)) === true
  );
}

function commentListIsSafe_(
  commentList: GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentList,
): commentList is SafeCommentList {
  return (
    commentList.comments?.every((comment) => commentIsSafe_(comment)) === true
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
  create: (
    resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
    fileId: string,
  ): SafeComment => {
    const ret = Drive.Comments.create(resource, fileId);
    if (!commentIsSafe_(ret)) {
      throw new Error("Comments.create: Comment is not safe.");
    }
    return ret;
  },

  list: (
    fileId: string,
    optionalArgs: {
      fields?: string;
      maxResults?: number;
      pageToken?: string | undefined;
    } = {},
  ): SafeCommentList => {
    const ret = Drive.Comments.list(fileId, optionalArgs);
    if (!commentListIsSafe_(ret)) {
      throw new Error("Comments.list: Comment list is not safe.");
    }
    return ret;
  },
};
