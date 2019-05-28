interface PublicEndpoints
{
	doGet(): GoogleAppsScript.HTML.HtmlOutput;
	getFolders(path: Array<Folder>): void;
	getSharedDrives(path: Array<Folder>): void;
	move(folder: string, sharedDrive: string, copyComments: boolean, notEmptyOverride: boolean): void;
}
