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

export class SafeCommentsCollection_ {
  private readonly unsafeComments: GoogleAppsScript.Drive_v3.Drive.V3.Collection.CommentsCollection;

  public constructor() {
    // TODO: Remove and access directly
    this.unsafeComments = Drive.Comments;
  }

  private static commentIsSafe(
    comment: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
  ): comment is SafeComment {
    return (
      comment.author !== undefined &&
      SafeCommentsCollection_.userIsSafe(comment.author) &&
      comment.id !== undefined &&
      comment.content !== undefined &&
      comment.replies?.every((reply) =>
        SafeCommentsCollection_.commentReplyIsSafe(reply),
      ) === true
    );
  }

  private static commentListIsSafe(
    commentList: GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentList,
  ): commentList is SafeCommentList {
    return (
      commentList.comments?.every((comment) =>
        SafeCommentsCollection_.commentIsSafe(comment),
      ) === true
    );
  }

  private static commentReplyIsSafe(
    commentReply: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply,
  ): commentReply is SafeReply {
    return (
      commentReply.author !== undefined &&
      SafeCommentsCollection_.userIsSafe(commentReply.author) &&
      commentReply.content !== undefined
    );
  }

  private static userIsSafe(
    user: GoogleAppsScript.Drive_v3.Drive.V3.Schema.User,
  ): user is SafeUser {
    return user.me !== undefined && user.displayName !== undefined;
  }

  public create(
    resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
    fileId: string,
  ): SafeComment {
    const ret = this.unsafeComments.create(resource, fileId);
    if (!SafeCommentsCollection_.commentIsSafe(ret)) {
      throw new Error("");
    }
    return ret;
  }

  public list(
    fileId: string,
    optionalArgs: {
      fields?: string;
      maxResults?: number;
      pageToken?: string | undefined;
    } = {},
  ): SafeCommentList {
    const ret = this.unsafeComments.list(fileId, optionalArgs);
    if (!SafeCommentsCollection_.commentListIsSafe(ret)) {
      throw new Error("");
    }
    return ret;
  }
}
