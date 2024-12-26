/// <reference types="google.script.client-side" />

import { doGet } from "./doGet";
import { listFolders } from "./listFolders";
import { listSharedDrives } from "./listSharedDrives";
import { move } from "./move";

declare const global: google.script.PublicEndpoints;

global["doGet"] = doGet;
global["listFolders"] = listFolders;
global["listSharedDrives"] = listSharedDrives;
global["move"] = move;
