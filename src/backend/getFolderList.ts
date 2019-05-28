export default function(root: string): Array<Folder>
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
