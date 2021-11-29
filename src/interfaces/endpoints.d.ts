import type { MoveResponse } from "./MoveResponse";
import type { NamedRecord } from "./NamedRecord";

declare namespace google.script {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PublicEndpoints {
    doGet(): GoogleAppsScript.HTML.HtmlOutput;
    listFolders(parentID: string): Promise<Array<NamedRecord>>;
    listSharedDrives(): Promise<Array<NamedRecord>>;
    move(
      folder: string,
      sharedDrive: string,
      copyComments: boolean,
      mergeFolders: boolean,
      notEmptyOverride: boolean
    ): Promise<MoveResponse>;
  }
}
