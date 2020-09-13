/* exported listFoldersInFolder */

function listFoldersInFolder(root: string): Array<NamedRecord>
{
	const ret = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
			includeItemsFromAllDrives: true,
			q: '"' + root + '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
			supportsAllDrives: true,
			pageToken: pageToken,
			maxResults: 1000,
			fields: 'nextPageToken, items(id, title)'
		});
		for(const item of response.items!)
		{
			ret.push({id: item.id!, name: item.title!});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	return ret;
}
