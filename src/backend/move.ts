global.start = function(folder: string, sharedDrive: string, copyComments: boolean, deleteOriginals: boolean, notEmptyOverride: boolean)
{
  if(!isSharedDriveEmpty_(sharedDrive, notEmptyOverride))
  {
    return {status: 'error', reason: 'notEmpty'};
  }
  moveFolderContents_(folder, sharedDrive, copyComments, deleteOriginals);
  return {status: 'success'};
}

function isSharedDriveEmpty_(sharedDrive: string, notEmptyOverride: boolean)
{
  if(notEmptyOverride)
  {
    return true;
  }
  var response = Drive.Files!.list({
    includeItemsFromAllDrives: true,
    maxResults: 1,
    q: '"' + sharedDrive + '" in parents and trashed = false',
    supportsAllDrives: true,
    fields: 'items(id)'
  });
  return response.items!.length === 0;
}

function moveFolderContents_(source: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
  moveFolderContentsFiles_(source, destination, copyComments, deleteOriginals);
  moveFolderContentsFolders_(source, destination, copyComments, deleteOriginals);
}

function moveFolderContentsFiles_(source: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
  var files = [];
  var pageToken = null;
  do
  {
    var response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q: '"' + source + '" in parents and mimeType != "application/vnd.google-apps.folder" and trashed = false',
      pageToken: pageToken,
      maxResults: 1000,
      fields: 'items(id, title, capabilities(canMoveItemOutOfDrive))'
    });
    for(var i in response.items)
    {
      // @ts-ignore
      files.push({id: response.items[i].id, name: response.items[i].title, canMove: response.items[i].capabilities.canMoveItemOutOfDrive});
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  for(var i in files)
  {
    if(files[i].canMove)
    {
      moveFile_(files[i].id, source, destination);
    }
    else
    {
      moveFileByCopy_(files[i].id, files[i].name, destination, copyComments, deleteOriginals);
    }
  }
}

function moveFile_(file: string, source: string, destination: string)
{
  Drive.Files!.update({}, file, null, {addParents: destination, removeParents: source, supportsAllDrives: true, fields: ''});
}

function moveFileByCopy_(file: string, name: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
  var copy = Drive.Files!.copy({parents: [{id: destination}], title: name}, file, {supportsAllDrives: true, fields: 'id'});
  if(copyComments)
  {
    copyFileComments_(file, copy.id!);
  }
  if(deleteOriginals)
  {
    deleteFile_(file);
  }
}

function copyFileComments_(source: string, destination: string)
{
  // TODO
}

function deleteFile_(file: string)
{
  var record = Drive.Files!.get(file, {fields: 'capabilities'});
  Logger.log(record);
  if(true || record.capabilities!.canTrash)
  {
    Drive.Files!.trash(file);
  }
}

function moveFolderContentsFolders_(source: string, destination: string, copyComments: boolean, deleteOriginals: boolean)
{
  var folders = [];
  var pageToken = null;
  do
  {
    var response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q: '"' + source + '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
      pageToken: pageToken,
      maxResults: 1000,
      fields: 'items(id, title)'
    });
    for(var item of response.items!)
    {
      folders.push({id: item.id, name: item.title});
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  for(var i in folders)
  {
    var newFolder = Drive.Files!.insert({parents: [{id: destination}], title: folders[i].name, mimeType: 'application/vnd.google-apps.folder'}, undefined, {supportsAllDrives: true, fields: 'id'});
    moveFolderContents_(folders[i].id!, newFolder.id!, copyComments, deleteOriginals);
    deleteFolderIfEmpty_(folders[i].id!);
  }
}

function deleteFolderIfEmpty_(folder: string)
{
  // TODO
}
