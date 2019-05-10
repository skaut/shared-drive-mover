interface PublicEndpoints
{
	doGet(): GoogleAppsScript.HTML.HtmlOutput;
	getFolders(path: Array<Folder>): void;
	getSharedDrives(): void;
	start(folder: string, sharedDrive: string, copyComments: boolean, deleteOriginals: boolean, notEmptyOverride: boolean): void;
}
