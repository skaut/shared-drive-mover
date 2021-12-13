export function mockedCommentsCollection(): GoogleAppsScript.Drive.Collection.CommentsCollection {
  return {
    get: jest.fn<
      GoogleAppsScript.Drive.Schema.Comment,
      [fileId: string, commentId: string]
    >(),
    insert: jest.fn<
      GoogleAppsScript.Drive.Schema.Comment,
      [resource: GoogleAppsScript.Drive.Schema.Comment, fileId: string]
    >(),
    list: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentList,
      [fileId: string]
    >(),
    patch: jest.fn<
      GoogleAppsScript.Drive.Schema.Comment,
      [
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
        commentId: string
      ]
    >(),
    remove: jest.fn<void, [fileId: string, commentId: string]>(), // eslint-disable-line @typescript-eslint/no-invalid-void-type
    update: jest.fn<
      GoogleAppsScript.Drive.Schema.Comment,
      [
        resource: GoogleAppsScript.Drive.Schema.Comment,
        fileId: string,
        commentId: string
      ]
    >(),
  };
}

export function mockedDrive(): GoogleAppsScript.Drive {
  return {
    newChannel: jest.fn<GoogleAppsScript.Drive.Schema.Channel, []>(),
    newChildReference: jest.fn<
      GoogleAppsScript.Drive.Schema.ChildReference,
      []
    >(),
    newComment: jest.fn<GoogleAppsScript.Drive.Schema.Comment, []>(),
    newCommentContext: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentContext,
      []
    >(),
    newCommentReply: jest.fn<GoogleAppsScript.Drive.Schema.CommentReply, []>(),
    newDrive: jest.fn<GoogleAppsScript.Drive.Schema.Drive, []>(),
    newDriveBackgroundImageFile: jest.fn<
      GoogleAppsScript.Drive.Schema.DriveBackgroundImageFile,
      []
    >(),
    newDriveCapabilities: jest.fn<
      GoogleAppsScript.Drive.Schema.DriveCapabilities,
      []
    >(),
    newDriveRestrictions: jest.fn<
      GoogleAppsScript.Drive.Schema.DriveRestrictions,
      []
    >(),
    newFile: jest.fn<GoogleAppsScript.Drive.Schema.File, []>(),
    newFileCapabilities: jest.fn<
      GoogleAppsScript.Drive.Schema.FileCapabilities,
      []
    >(),
    newFileImageMediaMetadata: jest.fn<
      GoogleAppsScript.Drive.Schema.FileImageMediaMetadata,
      []
    >(),
    newFileImageMediaMetadataLocation: jest.fn<
      GoogleAppsScript.Drive.Schema.FileImageMediaMetadataLocation,
      []
    >(),
    newFileIndexableText: jest.fn<
      GoogleAppsScript.Drive.Schema.FileIndexableText,
      []
    >(),
    newFileLabels: jest.fn<GoogleAppsScript.Drive.Schema.FileLabels, []>(),
    newFileThumbnail: jest.fn<
      GoogleAppsScript.Drive.Schema.FileThumbnail,
      []
    >(),
    newFileVideoMediaMetadata: jest.fn<
      GoogleAppsScript.Drive.Schema.FileVideoMediaMetadata,
      []
    >(),
    newParentReference: jest.fn<
      GoogleAppsScript.Drive.Schema.ParentReference,
      []
    >(),
    newPermission: jest.fn<GoogleAppsScript.Drive.Schema.Permission, []>(),
    newPermissionPermissionDetails: jest.fn<
      GoogleAppsScript.Drive.Schema.PermissionPermissionDetails,
      []
    >(),
    newPermissionTeamDrivePermissionDetails: jest.fn<
      GoogleAppsScript.Drive.Schema.PermissionTeamDrivePermissionDetails,
      []
    >(),
    newProperty: jest.fn<GoogleAppsScript.Drive.Schema.Property, []>(),
    newRevision: jest.fn<GoogleAppsScript.Drive.Schema.Revision, []>(),
    newTeamDrive: jest.fn<GoogleAppsScript.Drive.Schema.TeamDrive, []>(),
    newTeamDriveBackgroundImageFile: jest.fn<
      GoogleAppsScript.Drive.Schema.TeamDriveBackgroundImageFile,
      []
    >(),
    newTeamDriveCapabilities: jest.fn<
      GoogleAppsScript.Drive.Schema.TeamDriveCapabilities,
      []
    >(),
    newTeamDriveRestrictions: jest.fn<
      GoogleAppsScript.Drive.Schema.TeamDriveRestrictions,
      []
    >(),
    newUser: jest.fn<GoogleAppsScript.Drive.Schema.User, []>(),
    newUserPicture: jest.fn<GoogleAppsScript.Drive.Schema.UserPicture, []>(),
  };
}

export function mockedFilesCollection(): GoogleAppsScript.Drive.Collection.FilesCollection {
  return {
    copy: jest.fn<
      GoogleAppsScript.Drive.Schema.File,
      [resource: GoogleAppsScript.Drive.Schema.File, fileId: string]
    >(),
    emptyTrash: jest.fn<void, []>(), // eslint-disable-line @typescript-eslint/no-invalid-void-type
    export: jest.fn<void, [fileId: string, mimeType: string]>(), // eslint-disable-line @typescript-eslint/no-invalid-void-type
    generateIds: jest.fn<GoogleAppsScript.Drive.Schema.GeneratedIds, []>(),
    get: jest.fn<GoogleAppsScript.Drive.Schema.File, [fileId: string]>(),
    insert: jest.fn<
      GoogleAppsScript.Drive.Schema.File,
      [resource: GoogleAppsScript.Drive.Schema.File]
    >(),
    list: jest.fn<GoogleAppsScript.Drive.Schema.FileList, []>(),
    patch: jest.fn<
      GoogleAppsScript.Drive.Schema.File,
      [resource: GoogleAppsScript.Drive.Schema.File, fileId: string]
    >(),
    remove: jest.fn<void, [fileId: string]>(), // eslint-disable-line @typescript-eslint/no-invalid-void-type
    touch: jest.fn<GoogleAppsScript.Drive.Schema.File, [fileId: string]>(),
    trash: jest.fn<GoogleAppsScript.Drive.Schema.File, [fileId: string]>(),
    untrash: jest.fn<GoogleAppsScript.Drive.Schema.File, [fileId: string]>(),
    update: jest.fn<
      GoogleAppsScript.Drive.Schema.File,
      [resource: GoogleAppsScript.Drive.Schema.File, fileId: string]
    >(),
    watch: jest.fn<
      GoogleAppsScript.Drive.Schema.Channel,
      [resource: GoogleAppsScript.Drive.Schema.Channel, fileId: string]
    >(),
  };
}

export function mockedHtmlOutput(): GoogleAppsScript.HTML.HtmlOutput {
  return {
    addMetaTag: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [name: string, content: string]
    >(),
    append: jest.fn<GoogleAppsScript.HTML.HtmlOutput, [addedContent: string]>(),
    appendUntrusted: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [addedContent: string]
    >(),
    asTemplate: jest.fn<GoogleAppsScript.HTML.HtmlTemplate, []>(),
    clear: jest.fn<GoogleAppsScript.HTML.HtmlOutput, []>(),
    getAs: jest.fn<GoogleAppsScript.Base.Blob, [contentType: string]>(),
    getBlob: jest.fn<GoogleAppsScript.Base.Blob, []>(),
    getContent: jest.fn<string, []>(),
    getFaviconUrl: jest.fn<string, []>(),
    getHeight: jest.fn<GoogleAppsScript.Integer, []>(),
    getMetaTags: jest.fn<Array<GoogleAppsScript.HTML.HtmlOutputMetaTag>, []>(),
    getTitle: jest.fn<string, []>(),
    getWidth: jest.fn<GoogleAppsScript.Integer, []>(),
    setContent: jest.fn<GoogleAppsScript.HTML.HtmlOutput, [content: string]>(),
    setFaviconUrl: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [iconUrl: string]
    >(),
    setHeight: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [height: GoogleAppsScript.Integer]
    >(),
    setSandboxMode: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [mode: GoogleAppsScript.HTML.SandboxMode]
    >(),
    setTitle: jest.fn<GoogleAppsScript.HTML.HtmlOutput, [title: string]>(),
    setWidth: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [width: GoogleAppsScript.Integer]
    >(),
    setXFrameOptionsMode: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [mode: GoogleAppsScript.HTML.XFrameOptionsMode]
    >(),
  };
}

export function mockedHtmlService(): GoogleAppsScript.HTML.HtmlService {
  return {
    SandboxMode: 0 as unknown as typeof GoogleAppsScript.HTML.SandboxMode,
    XFrameOptionsMode:
      0 as unknown as typeof GoogleAppsScript.HTML.XFrameOptionsMode,
    createHtmlOutput: jest.fn<GoogleAppsScript.HTML.HtmlOutput, []>(),
    createHtmlOutputFromFile: jest.fn<
      GoogleAppsScript.HTML.HtmlOutput,
      [filename: string]
    >(),
    createTemplate: jest.fn<
      GoogleAppsScript.HTML.HtmlTemplate,
      [arg: GoogleAppsScript.Base.BlobSource | string]
    >(),
    createTemplateFromFile: jest.fn<GoogleAppsScript.HTML.HtmlTemplate, []>(),
    getUserAgent: jest.fn<string, []>(),
  };
}

export function mockedHtmlTemplate(): GoogleAppsScript.HTML.HtmlTemplate {
  return {
    evaluate: jest.fn<GoogleAppsScript.HTML.HtmlOutput, []>(),
    getCode: jest.fn<string, []>(),
    getCodeWithComments: jest.fn<string, []>(),
    getRawContent: jest.fn<string, []>(),
  };
}

export function mockedRepliesCollection(): GoogleAppsScript.Drive.Collection.RepliesCollection {
  return {
    get: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentReply,
      [fileId: string, commentId: string, replyId: string]
    >(),
    insert: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentReply,
      [
        resource: GoogleAppsScript.Drive.Schema.CommentReply,
        fileId: string,
        commentId: string
      ]
    >(),
    list: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentReplyList,
      [fileId: string, commentId: string]
    >(),
    patch: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentReply,
      [
        resource: GoogleAppsScript.Drive.Schema.CommentReply,
        fileId: string,
        commentId: string,
        replyId: string
      ]
    >(),
    remove: jest.fn<
      void, // eslint-disable-line @typescript-eslint/no-invalid-void-type
      [fileId: string, commentId: string, replyId: string]
    >(),
    update: jest.fn<
      GoogleAppsScript.Drive.Schema.CommentReply,
      [
        resource: GoogleAppsScript.Drive.Schema.CommentReply,
        fileId: string,
        commentId: string,
        replyId: string
      ]
    >(),
  };
}

export function mockedSession(): GoogleAppsScript.Base.Session {
  return {
    getActiveUser: jest.fn<GoogleAppsScript.Base.User, []>(),
    getActiveUserLocale: jest.fn<string, []>(),
    getEffectiveUser: jest.fn<GoogleAppsScript.Base.User, []>(),
    getScriptTimeZone: jest.fn<string, []>(),
    getTemporaryActiveUserKey: jest.fn<string, []>(),
    getTimeZone: jest.fn<string, []>(),
    getUser: jest.fn<GoogleAppsScript.Base.User, []>(),
  };
}
