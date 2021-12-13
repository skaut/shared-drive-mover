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
