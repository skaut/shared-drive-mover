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

interface CommentsListOptions {
  fields: string;
  maxResults: number;
  pageToken: string | undefined;
}

interface SafeCommentsCollection {
  insert(
    resource: GoogleAppsScript.Drive.Schema.Comment,
    fileId: string,
  ): SafeComment;
  list(fileId: string, optionalArgs: CommentsListOptions): SafeCommentList;
}

export class DriveService_ {
  private readonly unsafeComments: GoogleAppsScript.Drive.Collection.CommentsCollection;
  public readonly Comments: SafeCommentsCollection;
  public readonly Drives: GoogleAppsScript.Drive.Collection.DrivesCollection;
  public readonly Files: GoogleAppsScript.Drive.Collection.FilesCollection;
  public readonly Replies: GoogleAppsScript.Drive.Collection.RepliesCollection;

  public constructor() {
    if (
      Drive.Comments === undefined ||
      Drive.Drives === undefined ||
      Drive.Files === undefined ||
      Drive.Replies === undefined
    ) {
      throw new Error();
    }
    this.Comments = this.buildComments();
    this.Drives = Drive.Drives;
    this.Files = Drive.Files;
    this.Replies = Drive.Replies;
    this.unsafeComments = Drive.Comments;
  }

  private static commentIsSafe(
    comment: GoogleAppsScript.Drive.Schema.Comment,
  ): comment is SafeComment {
    return (
      comment.author !== undefined &&
      DriveService_.userIsSafe(comment.author) &&
      comment.commentId !== undefined &&
      comment.content !== undefined &&
      comment.replies?.every((reply) =>
        DriveService_.commentReplyIsSafe(reply),
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
      DriveService_.userIsSafe(commentReply.author) &&
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

  private buildComments(): SafeCommentsCollection {
    return {
      insert: (
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
      ): SafeComment => {
        const ret = this.unsafeComments.insert(resource, fileId);
        if (!DriveService_.commentIsSafe(ret)) {
          throw new Error("");
        }
        return ret;
      },
      list: (
        fileId: string,
        optionalArgs: CommentsListOptions,
      ): SafeCommentList => {
        const ret = this.unsafeComments.list(fileId, optionalArgs);
        if (!DriveService_.commentListIsSafe(ret)) {
          throw new Error("");
        }
        return ret;
      },
    };
  }
}
