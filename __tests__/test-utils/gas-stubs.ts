import { jest } from "@jest/globals";

/* eslint-disable @typescript-eslint/naming-convention -- These are stubs for external functions */

export function mockedCommentsCollection(): GoogleAppsScript.Drive.Collection.CommentsCollection {
  return {
    get: jest.fn<
      (
        fileId: string,
        commentId: string,
      ) => GoogleAppsScript.Drive.Schema.Comment
    >(),
    insert:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.Comment,
          fileId: string,
        ) => GoogleAppsScript.Drive.Schema.Comment
      >(),
    list: jest.fn<
      (fileId: string) => GoogleAppsScript.Drive.Schema.CommentList
    >(),
    patch:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.Comment,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive.Schema.Comment
      >(),
    remove: jest.fn<(fileId: string, commentId: string) => void>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.Comment,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive.Schema.Comment
      >(),
  };
}

export function mockedDrive(): GoogleAppsScript.Drive_v2 {
  return {
    newChannel: jest.fn<() => GoogleAppsScript.Drive.Schema.Channel>(),
    newChildReference:
      jest.fn<() => GoogleAppsScript.Drive.Schema.ChildReference>(),
    newComment: jest.fn<() => GoogleAppsScript.Drive.Schema.Comment>(),
    newCommentContext:
      jest.fn<() => GoogleAppsScript.Drive.Schema.CommentContext>(),
    newCommentReply:
      jest.fn<() => GoogleAppsScript.Drive.Schema.CommentReply>(),
    newDrive: jest.fn<() => GoogleAppsScript.Drive.Schema.Drive>(),
    newDriveBackgroundImageFile:
      jest.fn<() => GoogleAppsScript.Drive.Schema.DriveBackgroundImageFile>(),
    newDriveCapabilities:
      jest.fn<() => GoogleAppsScript.Drive.Schema.DriveCapabilities>(),
    newDriveRestrictions:
      jest.fn<() => GoogleAppsScript.Drive.Schema.DriveRestrictions>(),
    newFile: jest.fn<() => GoogleAppsScript.Drive.Schema.File>(),
    newFileCapabilities:
      jest.fn<() => GoogleAppsScript.Drive.Schema.FileCapabilities>(),
    newFileImageMediaMetadata:
      jest.fn<() => GoogleAppsScript.Drive.Schema.FileImageMediaMetadata>(),
    newFileImageMediaMetadataLocation:
      jest.fn<
        () => GoogleAppsScript.Drive.Schema.FileImageMediaMetadataLocation
      >(),
    newFileIndexableText:
      jest.fn<() => GoogleAppsScript.Drive.Schema.FileIndexableText>(),
    newFileLabels: jest.fn<() => GoogleAppsScript.Drive.Schema.FileLabels>(),
    newFileThumbnail:
      jest.fn<() => GoogleAppsScript.Drive.Schema.FileThumbnail>(),
    newFileVideoMediaMetadata:
      jest.fn<() => GoogleAppsScript.Drive.Schema.FileVideoMediaMetadata>(),
    newParentReference:
      jest.fn<() => GoogleAppsScript.Drive.Schema.ParentReference>(),
    newPermission: jest.fn<() => GoogleAppsScript.Drive.Schema.Permission>(),
    newPermissionPermissionDetails:
      jest.fn<
        () => GoogleAppsScript.Drive.Schema.PermissionPermissionDetails
      >(),
    newPermissionTeamDrivePermissionDetails:
      jest.fn<
        () => GoogleAppsScript.Drive.Schema.PermissionTeamDrivePermissionDetails
      >(),
    newProperty: jest.fn<() => GoogleAppsScript.Drive.Schema.Property>(),
    newRevision: jest.fn<() => GoogleAppsScript.Drive.Schema.Revision>(),
    newTeamDrive: jest.fn<() => GoogleAppsScript.Drive.Schema.TeamDrive>(),
    newTeamDriveBackgroundImageFile:
      jest.fn<
        () => GoogleAppsScript.Drive.Schema.TeamDriveBackgroundImageFile
      >(),
    newTeamDriveCapabilities:
      jest.fn<() => GoogleAppsScript.Drive.Schema.TeamDriveCapabilities>(),
    newTeamDriveRestrictions:
      jest.fn<() => GoogleAppsScript.Drive.Schema.TeamDriveRestrictions>(),
    newUser: jest.fn<() => GoogleAppsScript.Drive.Schema.User>(),
    newUserPicture: jest.fn<() => GoogleAppsScript.Drive.Schema.UserPicture>(),
  };
}

export function mockedDrivesCollection(): GoogleAppsScript.Drive.Collection.DrivesCollection {
  return {
    get: jest.fn<(driveId: string) => GoogleAppsScript.Drive.Schema.Drive>(),
    hide: jest.fn<(driveId: string) => GoogleAppsScript.Drive.Schema.Drive>(),
    insert:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.Drive,
          requestId: string,
        ) => GoogleAppsScript.Drive.Schema.Drive
      >(),
    list: jest.fn<() => GoogleAppsScript.Drive.Schema.DriveList>(),
    remove: jest.fn<(driveId: string) => void>(),
    unhide: jest.fn<(driveId: string) => GoogleAppsScript.Drive.Schema.Drive>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.Drive,
          driveId: string,
        ) => GoogleAppsScript.Drive.Schema.Drive
      >(),
  };
}

export function mockedFilesCollection(): GoogleAppsScript.Drive.Collection.FilesCollection {
  return {
    copy: jest.fn<
      (
        resource: GoogleAppsScript.Drive.Schema.File,
        fileId: string,
      ) => GoogleAppsScript.Drive.Schema.File
    >(),
    emptyTrash: jest.fn<() => void>(),
    export: jest.fn<(fileId: string, mimeType: string) => void>(),
    generateIds: jest.fn<() => GoogleAppsScript.Drive.Schema.GeneratedIds>(),
    get: jest.fn<(fileId: string) => GoogleAppsScript.Drive.Schema.File>(),
    insert:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          mediaData?: Blob,
        ) => GoogleAppsScript.Drive.Schema.File
      >(),
    list: jest.fn<() => GoogleAppsScript.Drive.Schema.FileList>(),
    patch:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fileId: string,
        ) => GoogleAppsScript.Drive.Schema.File
      >(),
    remove: jest.fn<(fileId: string) => void>(),
    touch: jest.fn<(fileId: string) => GoogleAppsScript.Drive.Schema.File>(),
    trash: jest.fn<(fileId: string) => GoogleAppsScript.Drive.Schema.File>(),
    untrash: jest.fn<(fileId: string) => GoogleAppsScript.Drive.Schema.File>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.File,
          fileId: string,
          mediaData?: Blob,
        ) => GoogleAppsScript.Drive.Schema.File
      >(),
    watch:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.Channel,
          fileId: string,
        ) => GoogleAppsScript.Drive.Schema.Channel
      >(),
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

export function mockedRepliesCollection(): GoogleAppsScript.Drive.Collection.RepliesCollection {
  return {
    get: jest.fn<
      (
        fileId: string,
        commentId: string,
        replyId: string,
      ) => GoogleAppsScript.Drive.Schema.CommentReply
    >(),
    insert:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.CommentReply,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive.Schema.CommentReply
      >(),
    list: jest.fn<
      (
        fileId: string,
        commentId: string,
      ) => GoogleAppsScript.Drive.Schema.CommentReplyList
    >(),
    patch:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.CommentReply,
          fileId: string,
          commentId: string,
          replyId: string,
        ) => GoogleAppsScript.Drive.Schema.CommentReply
      >(),
    remove:
      jest.fn<(fileId: string, commentId: string, replyId: string) => void>(),
    update:
      jest.fn<
        (
          resource: GoogleAppsScript.Drive.Schema.CommentReply,
          fileId: string,
          commentId: string,
          replyId: string,
        ) => GoogleAppsScript.Drive.Schema.CommentReply
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
    formatString: jest.fn<(template: string, ...args: Array<any>) => string>(),
    getUuid: jest.fn<() => string>(),
    gzip: jest.fn<
      (
        blob: GoogleAppsScript.Base.BlobSource,
        name?: string,
      ) => GoogleAppsScript.Base.Blob
    >(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
    jsonParse: jest.fn<(jsonString: string) => any>(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
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

/* eslint-enable */
