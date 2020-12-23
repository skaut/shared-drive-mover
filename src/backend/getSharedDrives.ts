/* exported getSharedDrives */

function addSharedDriveName(sharedDrive: NamedRecord): NamedRecord {
  if (sharedDrive.name) {
    return sharedDrive;
  }
  const response = Drive.Drives!.get(sharedDrive.id, { fields: "name" });
  return { id: sharedDrive.id, name: response.name! };
}

function getSharedDrives(path: Array<NamedRecord>): ListResponse {
  if (path.length == 0) {
    return { path: [], children: listSharedDrives() };
  }
  const namedPath = [addSharedDriveName(path[0])];
  if (path.length > 1) {
    namedPath.push(...addFolderPathNames(path.slice(1)));
  }
  return {
    path: namedPath,
    children: listFolders(path[path.length - 1].id),
  };
}
