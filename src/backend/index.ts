import { doGet } from "./doGet";
import { listFolders } from "./listFolders";
import { listSharedDrives } from "./listSharedDrives";
import { move } from "./move";

global.doGet = doGet;
global.listFolders = listFolders;
global.listSharedDrives = listSharedDrives;
global.move = move;
