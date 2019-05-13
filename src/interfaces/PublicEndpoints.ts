interface PublicEndpoints
{
	doGet(): GoogleAppsScript.HTML.HtmlOutput;
	getFolders(path: Array<Folder>): void;
	getSharedDrives(): void;
	move(folder: string, sharedDrive: string, copyComments: boolean, notEmptyOverride: boolean): void;
}
