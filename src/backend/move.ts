function isSharedDriveEmpty_(sharedDrive: string, notEmptyOverride: boolean)
{
	if(notEmptyOverride)
	{
		return true;
	}
	const response = Drive.Files!.list({
		includeItemsFromAllDrives: true,
		maxResults: 1,
		q: '"' + sharedDrive + '" in parents and trashed = false',
		supportsAllDrives: true,
		fields: 'items(id)'
	});
	return response.items!.length === 0;
}

function moveFile_(file: string, source: string, destination: string)
{
	Drive.Files!.update({}, file, null, {addParents: destination, removeParents: source, supportsAllDrives: true, fields: ''});
}

function copyFileComments_(source: string, destination: string)
{
	// TODO
}

function deleteFile_(file: string)
{
	const record = Drive.Files!.get(file, {fields: 'capabilities'});
	Logger.log(record);
	if(true || record.capabilities!.canTrash)
	{
		Drive.Files!.trash(file);
	}
}

function moveFileByCopy_(file: string, name: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
	const copy = Drive.Files!.copy({parents: [{id: destination}], title: name}, file, {supportsAllDrives: true, fields: 'id'});
	if(copyComments)
	{
		copyFileComments_(file, copy.id!);
	}
	if(deleteOriginals)
	{
		deleteFile_(file);
	}
}

function moveFolderContentsFiles_(source: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
	let files = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
			q: '"' + source + '" in parents and mimeType != "application/vnd.google-apps.folder" and trashed = false',
			pageToken: pageToken,
			maxResults: 1000,
			fields: 'items(id, title, capabilities(canMoveItemOutOfDrive))'
		});
		for(let item of response.items!)
		{
			// @ts-ignore
			files.push({id: item.id, name: item.title, canMove: item.capabilities!.canMoveItemOutOfDrive});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	for(let file of files)
	{
		if(file.canMove)
		{
			moveFile_(file.id!, source, destination);
		}
		else
		{
			moveFileByCopy_(file.id!, file.name!, destination, copyComments, deleteOriginals);
		}
	}
}

function deleteFolderIfEmpty_(folder: string)
{
	// TODO
}

function moveFolderContentsFolders_(source: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
	let folders = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
			q: '"' + source + '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
			pageToken: pageToken,
			maxResults: 1000,
			fields: 'items(id, title)'
		});
		for(let item of response.items!)
		{
			folders.push({id: item.id, name: item.title});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	for(let folder of folders)
	{
		const newFolder = Drive.Files!.insert({parents: [{id: destination}], title: folder.name, mimeType: 'application/vnd.google-apps.folder'}, undefined, {supportsAllDrives: true, fields: 'id'});
		moveFolderContents_(folder.id!, newFolder.id!, copyComments, deleteOriginals); // eslint-disable-line @typescript-eslint/no-use-before-define
		deleteFolderIfEmpty_(folder.id!);
	}
}

function moveFolderContents_(source: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
	moveFolderContentsFiles_(source, destination, copyComments, deleteOriginals);
	moveFolderContentsFolders_(source, destination, copyComments, deleteOriginals);
}

global.start = function(folder: string, sharedDrive: string, copyComments: boolean, deleteOriginals: boolean, notEmptyOverride: boolean)
{
	if(!isSharedDriveEmpty_(sharedDrive, notEmptyOverride))
	{
		return {status: 'error', reason: 'notEmpty'};
	}
	moveFolderContents_(folder, sharedDrive, copyComments, deleteOriginals);
	return {status: 'success'};
}
