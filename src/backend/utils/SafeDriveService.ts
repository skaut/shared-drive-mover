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
  public readonly Comments: typeof SafeCommentsCollection_;
  public readonly Drives: typeof SafeDrivesCollection_;
  public readonly Files: typeof SafeFilesCollection_;
  public readonly Replies: GoogleAppsScript.Drive_v3.Drive.V3.Collection.RepliesCollection;

  public constructor() {
    this.Comments = SafeCommentsCollection_;
    this.Drives = SafeDrivesCollection_;
    this.Files = SafeFilesCollection_;
    this.Replies = Drive.Replies;
  }
}
