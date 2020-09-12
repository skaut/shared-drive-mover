function isSharedDriveEmpty(sharedDrive: string, notEmptyOverride: boolean): boolean
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

function moveFile(file: string, source: string, destination: string): void
{
	Drive.Files!.update({}, file, null, {addParents: destination, removeParents: source, supportsAllDrives: true, fields: ''});
}

function copyFileComments(source: string, destination: string): void
{
	const comments = [];
	let pageToken = null;
	do {
		const response: GoogleAppsScript.Drive.Schema.CommentList = Drive.Comments!.list(source, {
			maxResults: 100,
			pageToken: pageToken,
			fields: 'nextPageToken, items(author(isAuthenticatedUser, displayName), content, status, context, anchor, replies(author(isAuthenticatedUser, displayName), content, verb))'
		});
		for(const comment of response.items!)
		{
			comments.push(comment);
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	for(const comment of comments)
	{
		if(!comment.author!.isAuthenticatedUser)
		{
			comment.content = '*' + comment.author!.displayName! + ':*\n' + comment.content!;
		}
		const replies = comment.replies!;
		delete comment.replies;
		const commentId = Drive.Comments!.insert(comment, destination).commentId!;
		for(const reply of replies)
		{
			if(!reply.author!.isAuthenticatedUser)
			{
				reply.content = '*' + reply.author!.displayName! + ':*\n' + reply.content!;
			}
			Drive.Replies!.insert(reply, destination, commentId);
		}
	}
}

function moveFileByCopy(file: string, name: string, destination: string, copyComments: boolean): void
{
	const copy = Drive.Files!.copy({parents: [{id: destination}], title: name}, file, {supportsAllDrives: true, fields: 'id'});
	if(copyComments)
	{
		copyFileComments(file, copy.id!);
	}
}

function moveFolderContentsFiles(source: string, destination: string, copyComments: boolean): number
{
	const files = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
			q: '"' + source + '" in parents and mimeType != "application/vnd.google-apps.folder" and trashed = false',
			pageToken: pageToken,
			maxResults: 1000,
			fields: 'nextPageToken, items(id, title, capabilities(canMoveItemOutOfDrive))'
		});
		for(const item of response.items!)
		{
			files.push({id: item.id, name: item.title, canMove: item.capabilities!.canMoveItemOutOfDrive});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	let errors = 0;
	for(const file of files)
	{
		try {
			if(file.canMove)
			{
				moveFile(file.id!, source, destination);
			}
			else
			{
				moveFileByCopy(file.id!, file.name!, destination, copyComments);
			}
		} catch (e) {
			console.warn(e)
			errors++;
		}
	}
	return errors;
}

function deleteFolderIfEmpty(folder: string): void
{
	const response = Drive.Files!.list({
		maxResults: 1,
		q: '"' + folder + '" in parents and trashed = false',
		fields: 'items(id)'
	});
	if(response.items!.length === 0)
	{
		const response2 = Drive.Files!.get(folder, {fields: 'userPermission(role)'});
		if(response2.userPermission!.role === 'owner' || response2.userPermission!.role === 'organizer')
		{
			Drive.Files!.remove(folder);
		}
	}
}

function moveFolderContentsFolders(source: string, destination: string, copyComments: boolean): void
{
	const folders = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
			q: '"' + source + '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
			pageToken: pageToken,
			maxResults: 1000,
			fields: 'nextPageToken, items(id, title)'
		});
		for(const item of response.items!)
		{
			folders.push({id: item.id, name: item.title});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	for(const folder of folders)
	{
		const newFolder = Drive.Files!.insert({parents: [{id: destination}], title: folder.name, mimeType: 'application/vnd.google-apps.folder'}, undefined, {supportsAllDrives: true, fields: 'id'});
		moveFolderContents(folder.id!, newFolder.id!, copyComments); // eslint-disable-line @typescript-eslint/no-use-before-define
		deleteFolderIfEmpty(folder.id!);
	}
}

function moveFolderContents(source: string, destination: string, copyComments: boolean): number
{
	const moveFileErrors = moveFolderContentsFiles(source, destination, copyComments);
	moveFolderContentsFolders(source, destination, copyComments);
	return moveFileErrors;
}

export default function(folder: string, sharedDrive: string, copyComments: boolean, notEmptyOverride: boolean): MoveResponse
{
	if(!isSharedDriveEmpty(sharedDrive, notEmptyOverride))
	{
		return {status: 'error', reason: 'notEmpty'};
	}
	const errors = moveFolderContents(folder, sharedDrive, copyComments);
	return {status: 'success', errors};
}
