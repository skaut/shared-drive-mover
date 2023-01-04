import type { ListResponse } from "../../interfaces/ListResponse";
import type { MoveResponse } from "../../interfaces/MoveResponse";

declare global {
  function doGet(): GoogleAppsScript.HTML.HtmlOutput;
  function listFolders(parentID: string): ListResponse;
  function listSharedDrives(): ListResponse;
  function move(
    sourceID: string,
    destinationID: string,
    copyComments: boolean,
    mergeFolders: boolean,
    notEmptyOverride: boolean
  ): MoveResponse;
}
