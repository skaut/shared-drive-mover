import { SafeCommentsCollection_ } from "./SafeDriveService/SafeCommentsCollection";

export type {
  SafeComment,
  SafeCommentList,
} from "./SafeDriveService/SafeCommentsCollection";

export class SafeDriveService_ {
  public readonly Comments: SafeCommentsCollection_;
  public readonly Drives: GoogleAppsScript.Drive.Collection.DrivesCollection;
  public readonly Files: GoogleAppsScript.Drive.Collection.FilesCollection;
  public readonly Replies: GoogleAppsScript.Drive.Collection.RepliesCollection;

  public constructor() {
    if (
      Drive.Drives === undefined ||
      Drive.Files === undefined ||
      Drive.Replies === undefined
    ) {
      throw new Error();
    }
    this.Comments = new SafeCommentsCollection_();
    this.Drives = Drive.Drives;
    this.Files = Drive.Files;
    this.Replies = Drive.Replies;
  }
}
