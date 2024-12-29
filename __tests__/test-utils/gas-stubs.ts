import { jest } from "@jest/globals";

/* eslint-disable @typescript-eslint/no-explicit-any -- These are stubs for external functions */

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
      jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel>(),
    newComment:
      jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment>(),
    newCommentQuotedFileContent:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentQuotedFileContent
      >(),
    newContentRestriction:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ContentRestriction
      >(),
    newDrive: jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive>(),
    newDriveBackgroundImageFile:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveBackgroundImageFile
      >(),
    newDriveCapabilities:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveCapabilities
      >(),
    newDriveRestrictions:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveRestrictions
      >(),
    newFile: jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File>(),
    newFileCapabilities:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileCapabilities
      >(),
    newFileContentHints:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileContentHints
      >(),
    newFileContentHintsThumbnail:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileContentHintsThumbnail
      >(),
    newFileImageMediaMetadata:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileImageMediaMetadata
      >(),
    newFileImageMediaMetadataLocation:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileImageMediaMetadataLocation
      >(),
    newFileLabelInfo:
      jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileLabelInfo>(),
    newFileLinkShareMetadata:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileLinkShareMetadata
      >(),
    newFileShortcutDetails:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileShortcutDetails
      >(),
    newFileVideoMediaMetadata:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileVideoMediaMetadata
      >(),
    newLabel: jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Label>(),
    newLabelFieldModification:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.LabelFieldModification
      >(),
    newLabelModification:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.LabelModification
      >(),
    newModifyLabelsRequest:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ModifyLabelsRequest
      >(),
    newPermission:
      jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission>(),
    newPermissionPermissionDetails:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionPermissionDetails
      >(),
    newPermissionTeamDrivePermissionDetails:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionTeamDrivePermissionDetails
      >(),
    newReply: jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply>(),
    newRevision:
      jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision>(),
    newTeamDrive:
      jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive>(),
    newTeamDriveBackgroundImageFile:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveBackgroundImageFile
      >(),
    newTeamDriveCapabilities:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveCapabilities
      >(),
    newTeamDriveRestrictions:
      jest.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveRestrictions
      >(),
    newUser: jest.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.User>(),
    Operation: mockedOperationCollection(),
    Operations: mockedOperationsCollection(),
    Permissions: mockedPermissionsCollection(),
    Replies: mockedRepliesCollection(),
    Revisions: mockedRevisionsCollection(),
    Teamdrives: mockedTeamdrivesCollection(),
  };
}

export function mockedHtmlOutput(): GoogleAppsScript.HTML.HtmlOutput {
  return {
    addMetaTag:
      jest.fn<
        (name: string, content: string) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    append:
      jest.fn<(addedContent: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    appendUntrusted:
      jest.fn<(addedContent: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    asTemplate: jest.fn<() => GoogleAppsScript.HTML.HtmlTemplate>(),
    clear: jest.fn<() => GoogleAppsScript.HTML.HtmlOutput>(),
    getAs: jest.fn<(contentType: string) => GoogleAppsScript.Base.Blob>(),
    getBlob: jest.fn<() => GoogleAppsScript.Base.Blob>(),
    getContent: jest.fn<() => string>(),
    getFaviconUrl: jest.fn<() => string>(),
    getHeight: jest.fn<() => GoogleAppsScript.Integer>(),
    getMetaTags:
      jest.fn<() => Array<GoogleAppsScript.HTML.HtmlOutputMetaTag>>(),
    getTitle: jest.fn<() => string>(),
    getWidth: jest.fn<() => GoogleAppsScript.Integer>(),
    setContent:
      jest.fn<(content: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    setFaviconUrl:
      jest.fn<(iconUrl: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    setHeight:
      jest.fn<
        (height: GoogleAppsScript.Integer) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    setSandboxMode:
      jest.fn<
        (
          mode: GoogleAppsScript.HTML.SandboxMode,
        ) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    setTitle: jest.fn<(title: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    setWidth:
      jest.fn<
        (width: GoogleAppsScript.Integer) => GoogleAppsScript.HTML.HtmlOutput
      >(),
    setXFrameOptionsMode:
      jest.fn<
        (
          mode: GoogleAppsScript.HTML.XFrameOptionsMode,
        ) => GoogleAppsScript.HTML.HtmlOutput
      >(),
  };
}

export function mockedHtmlService(): GoogleAppsScript.HTML.HtmlService {
  return {
    createHtmlOutput: jest.fn<() => GoogleAppsScript.HTML.HtmlOutput>(),
    createHtmlOutputFromFile:
      jest.fn<(filename: string) => GoogleAppsScript.HTML.HtmlOutput>(),
    createTemplate:
      jest.fn<
        (
          arg: GoogleAppsScript.Base.BlobSource | string,
        ) => GoogleAppsScript.HTML.HtmlTemplate
      >(),
    createTemplateFromFile: jest.fn<() => GoogleAppsScript.HTML.HtmlTemplate>(),
    getUserAgent: jest.fn<() => string>(),
    SandboxMode: 0 as unknown as typeof GoogleAppsScript.HTML.SandboxMode,
    XFrameOptionsMode:
      0 as unknown as typeof GoogleAppsScript.HTML.XFrameOptionsMode,
  };
}

export function mockedHtmlTemplate(): GoogleAppsScript.HTML.HtmlTemplate {
  return {
    evaluate: jest.fn<() => GoogleAppsScript.HTML.HtmlOutput>(),
    getCode: jest.fn<() => string>(),
    getCodeWithComments: jest.fn<() => string>(),
    getRawContent: jest.fn<() => string>(),
  };
}

export function mockedRepliesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.RepliesCollection {
  return {
    create:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply
      >(),
    get: jest.fn<
      (
        fileId: string,
        commentId: string,
        replyId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Reply
    >(),
    list: jest.fn<
      (
        fileId: string,
        commentId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ReplyList
    >(),
    remove:
      jest.fn<(fileId: string, commentId: string, replyId: string) => void>(),
    update:
      jest.fn<
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
    getActiveUser: jest.fn<() => GoogleAppsScript.Base.User>(),
    getActiveUserLocale: jest.fn<() => string>(),
    getEffectiveUser: jest.fn<() => GoogleAppsScript.Base.User>(),
    getScriptTimeZone: jest.fn<() => string>(),
    getTemporaryActiveUserKey: jest.fn<() => string>(),
    getTimeZone: jest.fn<() => string>(),
    getUser: jest.fn<() => GoogleAppsScript.Base.User>(),
  };
}

export function mockedUtilities(): GoogleAppsScript.Utilities.Utilities {
  return {
    base64Decode:
      jest.fn<
        (
          encoded: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    base64DecodeWebSafe:
      jest.fn<
        (
          encoded: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    base64Encode:
      jest.fn<
        (
          data: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => string
      >(),
    base64EncodeWebSafe:
      jest.fn<
        (
          data: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => string
      >(),
    Charset: { US_ASCII: 0, UTF_8: 1 },
    computeDigest:
      jest.fn<
        (
          algorithm: GoogleAppsScript.Utilities.DigestAlgorithm,
          value: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<number>
      >(),
    computeHmacSha256Signature:
      jest.fn<
        (
          value: Array<GoogleAppsScript.Byte> | string,
          key: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeHmacSignature:
      jest.fn<
        (
          algorithm: GoogleAppsScript.Utilities.MacAlgorithm,
          value: Array<GoogleAppsScript.Byte> | string,
          key: Array<GoogleAppsScript.Byte> | string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeRsaSha1Signature:
      jest.fn<
        (
          value: string,
          key: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeRsaSha256Signature:
      jest.fn<
        (
          value: string,
          key: string,
          charset?: GoogleAppsScript.Utilities.Charset,
        ) => Array<GoogleAppsScript.Byte>
      >(),
    computeRsaSignature:
      jest.fn<
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
      jest.fn<
        (
          date: GoogleAppsScript.Base.Date,
          timeZone: string,
          format: string,
        ) => string
      >(),
    formatString: jest.fn<(template: string, ...args: Array<any>) => string>(),
    getUuid: jest.fn<() => string>(),
    gzip: jest.fn<
      (
        blob: GoogleAppsScript.Base.BlobSource,
        name?: string,
      ) => GoogleAppsScript.Base.Blob
    >(),
    jsonParse: jest.fn<(jsonString: string) => any>(),
    jsonStringify: jest.fn<(obj: any) => string>(),
    MacAlgorithm: {
      HMAC_MD5: 0,
      HMAC_SHA_1: 1,
      HMAC_SHA_256: 2,
      HMAC_SHA_384: 3,
      HMAC_SHA_512: 4,
    },
    newBlob:
      jest.fn<
        (
          data: Array<GoogleAppsScript.Byte> | string,
          contentType?: string,
          name?: string,
        ) => GoogleAppsScript.Base.Blob
      >(),
    parseCsv:
      jest.fn<
        (csv: string, delimiter?: GoogleAppsScript.Char) => Array<Array<string>>
      >(),
    parseDate:
      jest.fn<(date: string, timeZone: string, format: string) => Date>(),
    RsaAlgorithm: { RSA_SHA_1: 0, RSA_SHA_256: 1 },
    sleep: jest.fn<(milliseconds: GoogleAppsScript.Integer) => void>(),
    ungzip:
      jest.fn<
        (blob: GoogleAppsScript.Base.BlobSource) => GoogleAppsScript.Base.Blob
      >(),
    unzip:
      jest.fn<
        (
          blob: GoogleAppsScript.Base.BlobSource,
        ) => Array<GoogleAppsScript.Base.Blob>
      >(),
    zip: jest.fn<
      (
        blobs: Array<GoogleAppsScript.Base.BlobSource>,
        name?: string,
      ) => GoogleAppsScript.Base.Blob
    >(),
  };
}

function mockedAboutCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.AboutCollection {
  return {
    get: jest.fn<
      (
        optionalArgs: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.About
    >(),
  };
}

function mockedAppsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.AppsCollection {
  return {
    get: jest.fn<
      (appId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.App
    >(),
    list: jest.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.AppList
    >(),
  };
}

function mockedChangesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.ChangesCollection {
  return {
    getStartPageToken:
      jest.fn<
        (
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.StartPageToken
      >(),
    list: jest.fn<
      (
        pageToken: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ChangeList
    >(),
    watch:
      jest.fn<
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
    stop: jest.fn<
      (resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel) => void
    >(),
  };
}

function mockedCommentsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.CommentsCollection {
  return {
    create:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
          fileId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
      >(),
    get: jest.fn<
      (
        fileId: string,
        commentId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
    >(),
    list: jest.fn<
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentList
    >(),
    remove: jest.fn<(fileId: string, commentId: string) => void>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
      >(),
  };
}

function mockedDrivesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.DrivesCollection {
  return {
    create:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
          requestId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
    get: jest.fn<
      (
        driveId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
    >(),
    hide: jest.fn<
      (driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
    >(),
    list: jest.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveList
    >(),
    remove:
      jest.fn<(driveId: string, optionalArgs?: Record<string, any>) => void>(),
    unhide:
      jest.fn<
        (driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
          driveId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
  };
}

function mockedFilesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.FilesCollection {
  return {
    copy: jest.fn<
      (
        resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
    >(),
    create:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          mediaData?: GoogleAppsScript.Base.Blob,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    download:
      jest.fn<
        (
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Operation
      >(),
    emptyTrash: jest.fn<(optionalArgs?: Record<string, any>) => void>(),
    export: jest.fn<(fileId: string, mimeType: string) => void>(),
    generateIds:
      jest.fn<
        (
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.GeneratedIds
      >(),
    get: jest.fn() as {
      (
        fileId: string,
        optionalArgs?: Record<string, any> & { alt: "media" },
      ): string;
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ): GoogleAppsScript.Drive_v3.Drive.V3.Schema.File;
    },
    list: jest.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileList
    >(),
    listLabels:
      jest.fn<
        (
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.LabelList
      >(),
    modifyLabels:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.ModifyLabelsRequest,
          fileId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ModifyLabelsResponse
      >(),
    remove:
      jest.fn<(fileId: string, optionalArgs?: Record<string, any>) => void>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fileId: string,
          mediaData?: GoogleAppsScript.Base.Blob,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    watch:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel,
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel
      >(),
  };
}

function mockedOperationCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.OperationCollection {
  return {
    cancel: jest.fn<(name: string) => void>(),
    remove: jest.fn<(name: string) => void>(),
  };
}

function mockedOperationsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.OperationsCollection {
  return {
    get: jest.fn<
      (name: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Operation
    >(),
    list: jest.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ListOperationsResponse
    >(),
  };
}

function mockedPermissionsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.PermissionsCollection {
  return {
    create:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission,
          fileId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission
      >(),
    get: jest.fn<
      (
        fileId: string,
        permissionId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission
    >(),
    list: jest.fn<
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionList
    >(),
    remove:
      jest.fn<
        (
          fileId: string,
          permissionId: string,
          optionalArgs?: Record<string, any>,
        ) => void
      >(),
    update:
      jest.fn<
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
    get: jest.fn<
      (
        fileId: string,
        revisionId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision
    >(),
    list: jest.fn<
      (
        fileId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.RevisionList
    >(),
    remove: jest.fn<(fileId: string, revisionId: string) => void>(),
    update:
      jest.fn<
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
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive,
          requestId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive
      >(),
    get: jest.fn<
      (
        teamDriveId: string,
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive
    >(),
    list: jest.fn<
      (
        optionalArgs?: Record<string, any>,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveList
    >(),
    remove: jest.fn<(teamDriveId: string) => void>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive,
          teamDriveId: string,
          optionalArgs?: Record<string, any>,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive
      >(),
  };
}

/* eslint-enable */
