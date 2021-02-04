/* exported listFolders */

function listFolders(parentID: string): Array<NamedRecord> {
  const ret = [];
  let pageToken = null;
  do {
    const response: GoogleAppsScript.Drive.Schema.FileList = Drive.Files!.list({
      q:
        '"' +
        parentID +
        '" in parents and (mimeType = "application/vnd.google-apps.folder" or (mimeType = "application/vnd.google-apps.shortcut" and shortcutDetails.targetMimeType = "application/vnd.google-apps.folder")) and trashed = false',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageToken: pageToken,
      maxResults: 1000,
      fields:
        "nextPageToken, items(id, title, mimeType, shortcutDetails(targetId))",
    });
    for (const item of response.items!) {
      const id =
        item.mimeType === "application/vnd.google-apps.shortcut"
          ? item.shortcutDetails!.targetId!
          : item.id!;
      ret.push({ id, name: item.title! });
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  return ret;
}
