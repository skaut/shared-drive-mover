export class DriveService_ {
  public readonly Files: GoogleAppsScript.Drive.Collection.FilesCollection;

  public constructor() {
    if (Drive.Files === undefined) {
      throw new Error();
    }
    this.Files = Drive.Files;
  }
}
