export default function(): Array<Folder>
{
	let ret = [];
	let pageToken = null;
	do
	{
		// @ts-ignore
		const response: GoogleAppsScript.Drive.Schema.DriveList = Drive.Drives!.list({
			pageToken: pageToken,
			maxResults: 100,
			fields: 'nextPageToken, items(id, name)'
		});
		for(let item of response.items!)
		{
			ret.push({id: item.id!, name: item.name!});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	return ret;
};
