function getCurrentPath_(path: Array<Folder>): Array<Folder>
{
	let ret = [];
	for(let segment of path)
	{
		if(segment.name)
		{
			ret.push(segment);
		}
		else
		{
			const response = Drive.Files!.get(segment.id, {
				fields: 'title'
			});
			ret.push({id: segment.id!, name: response.title!});
		}
	}
	return ret;
}

function getFolderList_(root: string): Array<Folder>
{
	let ret = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
			q: '"' + root + '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
			pageToken: pageToken,
			maxResults: 1000,
			fields: 'nextPageToken, items(id, title)'
		});
		for(let item of response.items!)
		{
			ret.push({id: item.id!, name: item.title!});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	return ret;
}

global.getFolders = function(path: Array<Folder>): FoldersResponse
{
	const root = path.length === 0 ? 'root' : path[path.length - 1].id;
	return {path: getCurrentPath_(path), folders: getFolderList_(root)};
};

global.getSharedDrives = function(): Array<Folder>
{  
	let ret = [];
	let pageToken = null;
	do
	{
		// @ts-ignore
		const response: GoogleAppsScript.Drive.Schema.DriveList = Drive.Drives.list({
			pageToken: pageToken,
			maxResults: 100,
			fields: 'nextPageToken, items(id, name)'
		});
		for(let item of response.items)
		{
			ret.push({id: item.id, name: item.name});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	return ret;
};

global.doGet = function(): GoogleAppsScript.HTML.HtmlOutput
{
	return HtmlService.createTemplateFromFile('index').evaluate().setTitle('Shared Drive Mover');
};
