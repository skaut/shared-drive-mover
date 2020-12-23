/* exported PublicEndpoints */

interface PublicEndpoints {
  doGet(): GoogleAppsScript.HTML.HtmlOutput;
  getFolders(path: Array<NamedRecord>): void;
  listSharedDrives(): Array<NamedRecord>;
  getSharedDrives(path: Array<NamedRecord>): void;
  move(
    folder: string,
    sharedDrive: string,
    copyComments: boolean,
    notEmptyOverride: boolean
  ): void;
}
