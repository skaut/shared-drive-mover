import { SafeCommentsCollection_ } from "./SafeDriveService/SafeCommentsCollection";
import { SafeFilesCollection_ } from "./SafeDriveService/SafeFilesCollection";

export type {
  SafeComment,
  SafeCommentList,
} from "./SafeDriveService/SafeCommentsCollection";

export type {
  SafeFile,
  SafeFileList,
} from "./SafeDriveService/SafeFilesCollection";

export class SafeDriveService_ {
  public readonly Comments: SafeCommentsCollection_;
  public readonly Drives: GoogleAppsScript.Drive.Collection.DrivesCollection;
  public readonly Files: SafeFilesCollection_;
  public readonly Replies: GoogleAppsScript.Drive.Collection.RepliesCollection;

  public constructor() {
    if (Drive.Drives === undefined || Drive.Replies === undefined) {
      throw new Error();
    }
    this.Comments = new SafeCommentsCollection_();
    this.Drives = Drive.Drives;
    this.Files = new SafeFilesCollection_();
    this.Replies = Drive.Replies;
  }
}
