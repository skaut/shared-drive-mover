import { vi } from "vitest";

export function mockedCommentsCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.CommentsCollection {
  return {
    get: vi.fn<
      (
        fileId: string,
        commentId: string,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
    >(),
    insert:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
          fileId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
      >(),
    list: vi.fn<
      (fileId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentList
    >(),
    patch:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment
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
    newChannel: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel>(),
    newChildReference:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ChildReference>(),
    newComment: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Comment>(),
    newCommentContext:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentContext>(),
    newCommentReply:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply>(),
    newDrive: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive>(),
    newDriveBackgroundImageFile:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveBackgroundImageFile>(),
    newDriveCapabilities:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveCapabilities>(),
    newDriveRestrictions:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveRestrictions>(),
    newFile: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File>(),
    newFileCapabilities:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileCapabilities>(),
    newFileImageMediaMetadata:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileImageMediaMetadata>(),
    newFileImageMediaMetadataLocation:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileImageMediaMetadataLocation
      >(),
    newFileIndexableText:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileIndexableText>(),
    newFileLabels: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileLabels>(),
    newFileThumbnail:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileThumbnail>(),
    newFileVideoMediaMetadata:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileVideoMediaMetadata>(),
    newParentReference:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.ParentReference>(),
    newPermission: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Permission>(),
    newPermissionPermissionDetails:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionPermissionDetails
      >(),
    newPermissionTeamDrivePermissionDetails:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.PermissionTeamDrivePermissionDetails
      >(),
    newProperty: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Property>(),
    newRevision: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Revision>(),
    newTeamDrive: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDrive>(),
    newTeamDriveBackgroundImageFile:
      vi.fn<
        () => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveBackgroundImageFile
      >(),
    newTeamDriveCapabilities:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveCapabilities>(),
    newTeamDriveRestrictions:
      vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.TeamDriveRestrictions>(),
    newUser: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.User>(),
    newUserPicture: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.UserPicture>(),
  };
}

export function mockedDrivesCollection(): GoogleAppsScript.Drive_v3.Drive.V3.Collection.DrivesCollection {
  return {
    get: vi.fn<(driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive>(),
    hide: vi.fn<(driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive>(),
    insert:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
          requestId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive
      >(),
    list: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.DriveList>(),
    remove: vi.fn<(driveId: string) => void>(),
    unhide: vi.fn<(driveId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Drive,
          driveId: string,
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
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
    >(),
    emptyTrash: vi.fn<() => void>(),
    export: vi.fn<(fileId: string, mimeType: string) => void>(),
    generateIds: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.GeneratedIds>(),
    get: vi.fn() as {
      (
        fileId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From upstream types
        optionalArgs?: Record<string, any> & { alt: "media" },
      ): string;
      (
        fileId: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From upstream types
        optionalArgs?: Record<string, any>,
      ): GoogleAppsScript.Drive_v3.Drive.V3.Schema.File;
    },
    insert:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          mediaData?: Blob,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    list: vi.fn<() => GoogleAppsScript.Drive_v3.Drive.V3.Schema.FileList>(),
    patch:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fileId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    remove: vi.fn<(fileId: string) => void>(),
    touch: vi.fn<(fileId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File>(),
    trash: vi.fn<(fileId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File>(),
    untrash: vi.fn<(fileId: string) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.File,
          fileId: string,
          mediaData?: Blob,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.File
      >(),
    watch:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.Channel,
          fileId: string,
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
    get: vi.fn<
      (
        fileId: string,
        commentId: string,
        replyId: string,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply
    >(),
    insert:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply,
          fileId: string,
          commentId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply
      >(),
    list: vi.fn<
      (
        fileId: string,
        commentId: string,
      ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReplyList
    >(),
    patch:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply,
          fileId: string,
          commentId: string,
          replyId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply
      >(),
    remove:
      vi.fn<(fileId: string, commentId: string, replyId: string) => void>(),
    update:
      vi.fn<
        (
          resource: GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply,
          fileId: string,
          commentId: string,
          replyId: string,
        ) => GoogleAppsScript.Drive_v3.Drive.V3.Schema.CommentReply
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
    formatString: vi.fn<(template: string, ...args: Array<any>) => string>(),
    getUuid: vi.fn<() => string>(),
    gzip: vi.fn<
      (
        blob: GoogleAppsScript.Base.BlobSource,
        name?: string,
      ) => GoogleAppsScript.Base.Blob
    >(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
    jsonParse: vi.fn<(jsonString: string) => any>(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- From Google apps script types
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
