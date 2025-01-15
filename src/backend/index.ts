/// <reference types="google.script.client-side" />

import { doGet } from "./doGet";
import { listFolders } from "./listFolders";
import { listSharedDrives } from "./listSharedDrives";
import { move } from "./move";

declare const globalThis: google.script.PublicEndpoints;

globalThis.doGet = doGet;
globalThis.listFolders = listFolders;
globalThis.listSharedDrives = listSharedDrives;
globalThis.move = move;
