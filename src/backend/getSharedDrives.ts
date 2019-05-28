import getCurrentPath from './getCurrentPath';
import getFolderList from './getFolderList';

function getSharedDriveName(sharedDrive: Folder): Folder
{
	if(sharedDrive.name)
	{
		return sharedDrive;
	}
	const response = Drive.Drives!.get(sharedDrive.id, {fields: 'name'});
	return {id: sharedDrive.id, name: response.name!};
}

function getSharedDriveList(): Array<Folder>
{
	let ret = [];
	let pageToken = null;
	do
	{
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

export default function(path: Array<Folder>): PathResponse
{
	if(path.length == 0)
	{
		return {path: [], children: getSharedDriveList()};
	}
	let namedPath = [getSharedDriveName(path[0])];
	if(path.length > 1)
	{
		namedPath.push(...getCurrentPath(path.slice(1)));
	}
	return {path: namedPath, children: getFolderList(path[path.length - 1].id)};
};
