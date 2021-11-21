/* exported listSharedDrives */

function listSharedDrives(): Array<NamedRecord> {
  return paginationHelper<GoogleAppsScript.Drive.Schema.DriveList, NamedRecord>(
    (pageToken) =>
      Drive.Drives!.list({
        pageToken: pageToken,
        maxResults: 100,
        orderBy: "name",
        fields: "nextPageToken, items(id, name)",
      }),
    (response) =>
      response.items!.map((item) => ({ id: item.id!, name: item.name! }))
  );
}
