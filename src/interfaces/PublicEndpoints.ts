/* exported PublicEndpoints */

interface PublicEndpoints {
  doGet(): GoogleAppsScript.HTML.HtmlOutput;
  listFolders(parentID: string): Array<NamedRecord>;
  listSharedDrives(): Array<NamedRecord>;
  move(
    folder: string,
    sharedDrive: string,
    copyComments: boolean,
    mergeFolders: boolean,
    notEmptyOverride: boolean
  ): void;
}
