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
  public readonly Replies: GoogleAppsScript.Drive_v3.Drive.V3.Collection.RepliesCollection;

  public constructor() {
    this.Comments = new SafeCommentsCollection_();
    this.Drives = new SafeDrivesCollection_();
    this.Files = new SafeFilesCollection_();
    this.Replies = Drive.Replies;
  }
}
