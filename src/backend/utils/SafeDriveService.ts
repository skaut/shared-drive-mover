import { SafeCommentsCollection_ } from "./SafeDriveService/SafeCommentsCollection";
import { SafeDrivesCollection_ } from "./SafeDriveService/SafeDrivesCollection";
import { SafeFilesCollection_ } from "./SafeDriveService/SafeFilesCollection";

export type {
  SafeComment,
  SafeCommentList,
} from "./SafeDriveService/SafeCommentsCollection";
export type {
  SafeDrive,
  SafeDriveList,
} from "./SafeDriveService/SafeDrivesCollection";
export type {
  SafeFile,
  SafeFileList,
} from "./SafeDriveService/SafeFilesCollection";

export class SafeDriveService_ {
  public readonly Comments: SafeCommentsCollection_;
  public readonly Drives: SafeDrivesCollection_;
  public readonly Files: SafeFilesCollection_;
  public readonly Replies: GoogleAppsScript.Drive.Collection.RepliesCollection;

  public constructor() {
    if (Drive.Replies === undefined) {
      throw new Error();
    }
    this.Comments = new SafeCommentsCollection_();
    this.Drives = new SafeDrivesCollection_();
    this.Files = new SafeFilesCollection_();
    this.Replies = Drive.Replies;
  }
}
