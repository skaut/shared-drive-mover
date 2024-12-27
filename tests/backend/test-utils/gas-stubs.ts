import { vi } from "vitest";

export function mockedCommentsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.CommentsCollection {
  return {
    create:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
          fileId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
      >(),
    get: vi.fn<
      (
        fileId: string,
        commentId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
    >(),
    list: vi.fn<
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentList
    >(),
    remove: vi.fn<(fileId: string, commentId: string) => void>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
      >(),
  };
}

export function mockedDrive(): GoogleAppsScript.Drive {
  return {
    About: mockedAboutCollection(),
    Apps: mockedAppsCollection(),
    Changes: mockedChangesCollection(),
    Channels: mockedChannelsCollection(),
    Comments: mockedCommentsCollection(),
    Drives: mockedDrivesCollection(),
    Files: mockedFilesCollection(),
    newChannel:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel>(),
    newComment:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment>(),
    newCommentQuotedFileContent:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentQuotedFileContent
      >(),
    newContentRestriction:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ContentRestriction
      >(),
    newDrive: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive>(),
    newDriveBackgroundImageFile:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveBackgroundImageFile
      >(),
    newDriveCapabilities:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveCapabilities
      >(),
    newDriveRestrictions:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveRestrictions
      >(),
    newFile: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File>(),
    newFileCapabilities:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileCapabilities>(),
    newFileContentHints:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileContentHints>(),
    newFileContentHintsThumbnail:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileContentHintsThumbnail
      >(),
    newFileImageMediaMetadata:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileImageMediaMetadata
      >(),
    newFileImageMediaMetadataLocation:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileImageMediaMetadataLocation
      >(),
    newFileLabelInfo:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileLabelInfo>(),
    newFileLinkShareMetadata:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileLinkShareMetadata
      >(),
    newFileShortcutDetails:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileShortcutDetails
      >(),
    newFileVideoMediaMetadata:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileVideoMediaMetadata
      >(),
    newLabel: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Label>(),
    newLabelFieldModification:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.LabelFieldModification
      >(),
    newLabelModification:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.LabelModification
      >(),
    newModifyLabelsRequest:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ModifyLabelsRequest
      >(),
    newPermission:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission>(),
    newPermissionPermissionDetails:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionPermissionDetails
      >(),
    newPermissionTeamDrivePermissionDetails:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionTeamDrivePermissionDetails
      >(),
    newReply: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply>(),
    newRevision:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision>(),
    newTeamDrive:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive>(),
    newTeamDriveBackgroundImageFile:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveBackgroundImageFile
      >(),
    newTeamDriveCapabilities:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveCapabilities
      >(),
    newTeamDriveRestrictions:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveRestrictions
      >(),
    newUser: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.User>(),
    Operation: mockedOperationCollection(),
    Operations: mockedOperationsCollection(),
    Permissions: mockedPermissionsCollection(),
    Replies: mockedRepliesCollection(),
    Revisions: mockedRevisionsCollection(),
    Teamdrives: mockedTeamdrivesCollection(),
  };
}

export function mockedDrivesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.DrivesCollection {
  return {
    create:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
          requestId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
    get: vi.fn<
      (
        driveId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
    >(),
    hide: vi.fn<
      (driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
    >(),
    list: vi.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveList
    >(),
    remove:
      vi.fn<(driveId: string, optionalArgs?: Record<string, any>) => void>(),
    unhide:
      vi.fn<
        (driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
          driveId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
  };
}

export function mockedFilesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.FilesCollection {
  return {
    copy: vi.fn<
      (
        resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
    >(),
    create:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          mediaData?: GoogleAppsScript.Base.Blob,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    download:
      vi.fn<
        (
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Operation
      >(),
    emptyTrash: vi.fn<(optionalArgs?: Record<string, any>) => void>(),
    export: vi.fn<(fileId: string, mimeType: string) => void>(),
    generateIds:
      vi.fn<
        (
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.GeneratedIds
      >(),
    get: vi.fn() as {
      (
        fileId: string,
        optionalArgs?: Record<string, any> & { alt: "media" },
      ): string;
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ): GoogleAppsScript.Drive_v3.Drive.V3.Schema.File;
    },
    list: vi.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileList
    >(),
    listLabels:
      vi.fn<
        (
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.LabelList
      >(),
    modifyLabels:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.ModifyLabelsRequest,
          fileId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ModifyLabelsResponse
      >(),
    remove:
      vi.fn<(fileId: string, optionalArgs?: Record<string, any>) => void>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fileId: string,
          mediaData?: GoogleAppsScript.Base.Blob,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    watch:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel,
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel
      >(),
  };
}

export function mockedHtmlOutput(): GoogleAppsScript.HTML.HtmlOutput {
  return {
    addMetaTag:
      vi.fn<
        (name: string, content: string) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    append: vi.fn<(addedContent: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    appendUntrusted:
      vi.fn<(addedContent: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    asTemplate: vi.fn<() => GoogleAppsScript.HTML.HtmlTemplate>(),
    clear: vi.fn<() => GoogleAppsScript.HTML.HtmlOutput>(),
    getAs: vi.fn<(contentType: string) => GoogleAppsScript.Base.Blob>(),
    getBlob: vi.fn<() => GoogleAppsScript.Base.Blob>(),
    getContent: vi.fn<() => string>(),
    getFaviconUrl: vi.fn<() => string>(),
    getHeight: vi.fn<() => GoogleAppsScript.Integer>(),
    getMetaTags: vi.fn<() => Array<GoogleAppsScript.HTML.HtmlOutputMetaTag>>(),
    getTitle: vi.fn<() => string>(),
    getWidth: vi.fn<() => GoogleAppsScript.Integer>(),
    setContent: vi.fn<(content: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    setFaviconUrl:
      vi.fn<(iconUrl: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    setHeight:
      vi.fn<
        (height: GoogleAppsScript.Integer) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    setSandboxMode:
      vi.fn<
        (
          mode: GoogleAppsScript.HTML.SandboxMode,
        ) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    setTitle: vi.fn<(title: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    setWidth:
      vi.fn<
        (width: GoogleAppsScript.Integer) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    setXFrameOptionsMode:
      vi.fn<
        (
          mode: GoogleAppsScript.HTML.XFrameOptionsMode,
        ) => GoogleAppsScript.HTML.HtmlOutput
      >(),
  };
}

export function mockedHtmlService(): GoogleAppsScript.HTML.HtmlService {
  return {
    createHtmlOutput: vi.fn<() => GoogleAppsScript.HTML.HtmlOutput>(),
    createHtmlOutputFromFile:
      vi.fn<(filename: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    createTemplate:
      vi.fn<
        (
          arg: GoogleAppsScript.Base.BlobSource | string,
        ) => GoogleAppsScript.HTML.HtmlTemplate
      >(),
    createTemplateFromFile: vi.fn<() => GoogleAppsScript.HTML.HtmlTemplate>(),
    getUserAgent: vi.fn<() => string>(),
    SandboxMode: 0 as unknown as typeof GoogleAppsScript.HTML.SandboxMode,
    XFrameOptionsMode:
      0 as unknown as typeof GoogleAppsScript.HTML.XFrameOptionsMode,
  };
}

export function mockedHtmlTemplate(): GoogleAppsScript.HTML.HtmlTemplate {
  return {
    evaluate: vi.fn<() => GoogleAppsScript.HTML.HtmlOutput>(),
    getCode: vi.fn<() => string>(),
    getCodeWithComments: vi.fn<() => string>(),
    getRawContent: vi.fn<() => string>(),
  };
}

export function mockedRepliesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.RepliesCollection {
  return {
    create:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply
      >(),
    get: vi.fn<
      (
        fileId: string,
        commentId: string,
        replyId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply
    >(),
    list: vi.fn<
      (
        fileId: string,
        commentId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ReplyList
    >(),
    remove:
      vi.fn<(fileId: string, commentId: string, replyId: string) => void>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply,
          fileId: string,
          commentId: string,
          replyId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply
      >(),
  };
}

export function mockedSession(): GoogleAppsScript.Base.Session {
  return {
    getActiveUser: vi.fn<() => GoogleAppsScript.Base.User>(),
    getActiveUserLocale: vi.fn<() => string>(),
    getEffectiveUser: vi.fn<() => GoogleAppsScript.Base.User>(),
    getScriptTimeZone: vi.fn<() => string>(),
    getTemporaryActiveUserKey: vi.fn<() => string>(),
    getTimeZone: vi.fn<() => string>(),
    getUser: vi.fn<() => GoogleAppsScript.Base.User>(),
  };
}

export function mockedUtilities(): GoogleAppsScript.Utilities.Utilities {
  return {
    base64Decode:
      vi.fn<
        (
          encoded: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    base64DecodeWebSafe:
      vi.fn<
        (
          encoded: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    base64Encode:
      vi.fn<
        (
          data: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => string
      >(),
    base64EncodeWebSafe:
      vi.fn<
        (
          data: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => string
      >(),
    Charset: { US_ASCII: 0, UTF_8: 1 },
    computeDigest:
      vi.fn<
        (
          algorithm: GoogleAppsScript.Utilities.DigestAlgorithm,
          value: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<number>
      >(),
    computeHmacSha256Signature:
      vi.fn<
        (
          value: Array<GoogleAppsScript.Byte> | string,
          key: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeHmacSignature:
      vi.fn<
        (
          algorithm: GoogleAppsScript.Utilities.MacAlgorithm,
          value: Array<GoogleAppsScript.Byte> | string,
          key: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeRsaSha1Signature:
      vi.fn<
        (
          value: string,
          key: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeRsaSha256Signature:
      vi.fn<
        (
          value: string,
          key: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeRsaSignature:
      vi.fn<
        (
          algorithm: GoogleAppsScript.Utilities.RsaAlgorithm,
          value: string,
          key: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    DigestAlgorithm: {
      MD2: 0,
      MD5: 1,
      SHA_1: 2,
      SHA_256: 3,
      SHA_384: 4,
      SHA_512: 5,
    },
    formatDate:
      vi.fn<
        (
          date: GoogleAppsScript.Base.Date,
          timeZone: string,
          format: string,
        ) => string
      >(),
    formatString: vi.fn<(template: string, ...args: Array<any>) => string>(),
    getUuid: vi.fn<() => string>(),
    gzip: vi.fn<
      (
        blob: GoogleAppsScript.Base.BlobSource,
        name?: string,
      ) => GoogleAppsScript.Base.Blob
    >(),
    jsonParse: vi.fn<(jsonString: string) => any>(),
    jsonStringify: vi.fn<(obj: any) => string>(),
    MacAlgorithm: {
      HMAC_MD5: 0,
      HMAC_SHA_1: 1,
      HMAC_SHA_256: 2,
      HMAC_SHA_384: 3,
      HMAC_SHA_512: 4,
    },
    newBlob:
      vi.fn<
        (
          data: Array<GoogleAppsScript.Byte> | string,
          contentType?: string,
          name?: string,
        ) => GoogleAppsScript.Base.Blob
      >(),
    parseCsv:
      vi.fn<
        (csv: string, delimiter?: GoogleAppsScript.Char) => Array<Array<string>>
      >(),
    parseDate:
      vi.fn<(date: string, timeZone: string, format: string) => Date>(),
    RsaAlgorithm: { RSA_SHA_1: 0, RSA_SHA_256: 1 },
    sleep: vi.fn<(milliseconds: GoogleAppsScript.Integer) => void>(),
    ungzip:
      vi.fn<
        (blob: GoogleAppsScript.Base.BlobSource) => GoogleAppsScript.Base.Blob
      >(),
    unzip:
      vi.fn<
        (
          blob: GoogleAppsScript.Base.BlobSource,
        ) => Array<GoogleAppsScript.Base.Blob>
      >(),
    zip: vi.fn<
      (
        blobs: Array<GoogleAppsScript.Base.BlobSource>,
        name?: string,
      ) => GoogleAppsScript.Base.Blob
    >(),
  };
}

function mockedAboutCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.AboutCollection {
  return {
    get: vi.fn<
      (
        optionalArgs: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.About
    >(),
  };
}

function mockedAppsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.AppsCollection {
  return {
    get: vi.fn<
      (appId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.App
    >(),
    list: vi.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.AppList
    >(),
  };
}

function mockedChangesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.ChangesCollection {
  return {
    getStartPageToken:
      vi.fn<
        (
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.StartPageToken
      >(),
    list: vi.fn<
      (
        pageToken: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ChangeList
    >(),
    watch:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel,
          pageToken: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel
      >(),
  };
}

function mockedChannelsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.ChannelsCollection {
  return {
    stop: vi.fn<
      (resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel) => void
    >(),
  };
}

function mockedOperationCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.OperationCollection {
  return {
    cancel: vi.fn<(name: string) => void>(),
    remove: vi.fn<(name: string) => void>(),
  };
}

function mockedOperationsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.OperationsCollection {
  return {
    get: vi.fn<
      (name: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Operation
    >(),
    list: vi.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ListOperationsResponse
    >(),
  };
}

function mockedPermissionsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.PermissionsCollection {
  return {
    create:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission,
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission
      >(),
    get: vi.fn<
      (
        fileId: string,
        permissionId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission
    >(),
    list: vi.fn<
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionList
    >(),
    remove:
      vi.fn<
        (
          fileId: string,
          permissionId: string,
          optionalArgs?: Record<string, any>,
        ) => void
      >(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission,
          fileId: string,
          permissionId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission
      >(),
  };
}

function mockedRevisionsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.RevisionsCollection {
  return {
    get: vi.fn<
      (
        fileId: string,
        revisionId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision
    >(),
    list: vi.fn<
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.RevisionList
    >(),
    remove: vi.fn<(fileId: string, revisionId: string) => void>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision,
          fileId: string,
          revisionId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision
      >(),
  };
}

function mockedTeamdrivesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.TeamdrivesCollection {
  return {
    create:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive,
          requestId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive
      >(),
    get: vi.fn<
      (
        teamDriveId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive
    >(),
    list: vi.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveList
    >(),
    remove: vi.fn<(teamDriveId: string) => void>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive,
          teamDriveId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive
      >(),
  };
}
