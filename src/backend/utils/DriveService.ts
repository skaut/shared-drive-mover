export class DriveService_ {
  public readonly Comments: GoogleAppsScript.Drive.Collection.CommentsCollection;
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
    this.Comments = Drive.Comments;
    this.Drives = Drive.Drives;
    this.Files = Drive.Files;
    this.Replies = Drive.Replies;
  }
}
