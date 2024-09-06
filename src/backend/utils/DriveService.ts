export class DriveService_ {
  public readonly Comments: GoogleAppsScript.Drive.Collection.CommentsCollection;
  public readonly Files: GoogleAppsScript.Drive.Collection.FilesCollection;
  public readonly Replies: GoogleAppsScript.Drive.Collection.RepliesCollection;

  public constructor() {
    if (
      Drive.Comments === undefined ||
      Drive.Files === undefined ||
      Drive.Replies === undefined
    ) {
      throw new Error();
    }
    this.Comments = Drive.Comments;
    this.Files = Drive.Files;
    this.Replies = Drive.Replies;
  }
}
