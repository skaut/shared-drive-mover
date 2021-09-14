/* exported listFolders */

async function listFolders(parentID: string): Promise<Array<NamedRecord>> {
  return await paginationHelper(
    (pageToken) =>
      Drive.Files!.list({
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
      }),
    (response) =>
      response.items!.map((item) => {
        const id =
          item.mimeType === "application/vnd.google-apps.shortcut"
            ? item.shortcutDetails!.targetId!
            : item.id!;
        return { id, name: item.title! };
      })
  );
}
