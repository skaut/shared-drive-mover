import type { ListResponse } from "./ListResponse";
import type { MoveResponse } from "./MoveResponse";

declare namespace google.script {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PublicEndpoints {
    doGet(): GoogleAppsScript.HTML.HtmlOutput;
    listFolders(parentID: string): ListResponse;
    listSharedDrives(): ListResponse;
    move(
      sourceID: string,
      destinationID: string,
      copyComments: boolean,
      mergeFolders: boolean,
      notEmptyOverride: boolean
    ): MoveResponse;
  }
}
