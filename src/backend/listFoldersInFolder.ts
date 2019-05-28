export default function(root: string): Array<NamedRecord>
{
	let ret = [];
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
		for(let item of response.items!)
		{
			ret.push({id: item.id!, name: item.title!});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	return ret;
}
