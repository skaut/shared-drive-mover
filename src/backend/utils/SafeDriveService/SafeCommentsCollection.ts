export interface SafeComment {
  author: SafeUser;
  commentId: string;
  content: string;
  replies: Array<SafeCommentReply>;
}

export interface SafeCommentList {
  items: Array<SafeComment>;
  nextPageToken?: string | undefined;
}

interface SafeCommentReply {
  author: SafeUser;
  content: string;
}

interface SafeUser {
  displayName: string;
  isAuthenticatedUser: boolean;
}

export class SafeCommentsCollection_ {
  private readonly unsafeComments: GoogleAppsScript.Drive.Collection.CommentsCollection;

  public constructor() {
    if (Drive.Comments === undefined) {
      throw new Error();
    }
    this.unsafeComments = Drive.Comments;
  }

  private static commentIsSafe(
    comment: GoogleAppsScript.Drive.Schema.Comment,
  ): comment is SafeComment {
    return (
      comment.author !== undefined &&
      SafeCommentsCollection_.userIsSafe(comment.author) &&
      comment.commentId !== undefined &&
      comment.content !== undefined &&
      comment.replies?.every((reply) =>
        SafeCommentsCollection_.commentReplyIsSafe(reply),
      ) === true
    );
  }

  private static commentListIsSafe(
    commentList: GoogleAppsScript.Drive.Schema.CommentList,
  ): commentList is SafeCommentList {
    return commentList.items !== undefined;
  }

  private static commentReplyIsSafe(
    commentReply: GoogleAppsScript.Drive.Schema.CommentReply,
  ): commentReply is SafeCommentReply {
    return (
      commentReply.author !== undefined &&
      SafeCommentsCollection_.userIsSafe(commentReply.author) &&
      commentReply.content !== undefined
    );
  }

  private static userIsSafe(
    user: GoogleAppsScript.Drive.Schema.User,
  ): user is SafeUser {
    return (
      user.isAuthenticatedUser !== undefined && user.displayName !== undefined
    );
  }

  public insert(
    resource: GoogleAppsScript.Drive.Schema.Comment,
    fileId: string,
  ): SafeComment {
    const ret = this.unsafeComments.insert(resource, fileId);
    if (!SafeCommentsCollection_.commentIsSafe(ret)) {
      throw new Error("");
    }
    return ret;
  }

  public list(
    fileId: string,
    optionalArgs: {
      fields: string;
      maxResults: number;
      pageToken: string | undefined;
    },
  ): SafeCommentList {
    const ret = this.unsafeComments.list(fileId, optionalArgs);
    if (!SafeCommentsCollection_.commentListIsSafe(ret)) {
      throw new Error("");
    }
    return ret;
  }
}
