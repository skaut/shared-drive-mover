import type { MoveResponse } from "./MoveResponse";
import type { NamedRecord } from "./NamedRecord";

declare namespace google.script {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PublicEndpoints {
    doGet(): GoogleAppsScript.HTML.HtmlOutput;
    listFolders(parentID: string): Array<NamedRecord>;
    listSharedDrives(): Array<NamedRecord>;
    move(
      sourceID: string,
      destinationID: string,
      copyComments: boolean,
      mergeFolders: boolean,
      notEmptyOverride: boolean
    ): MoveResponse;
  }
}
