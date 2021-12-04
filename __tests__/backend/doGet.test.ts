import { doGet } from "../../src/backend/doGet";

test("doGet works correctly", () => {
  function emptyHtmlOutput(): GoogleAppsScript.HTML.HtmlOutput {
    return {
      addMetaTag: jest.fn<
        GoogleAppsScript.HTML.HtmlOutput,
        [name: string, content: string]
      >(),
      append: jest.fn<
        GoogleAppsScript.HTML.HtmlOutput,
        [addedContent: string]
      >(),
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
      getMetaTags: jest.fn<
        Array<GoogleAppsScript.HTML.HtmlOutputMetaTag>,
        []
      >(),
      getTitle: jest.fn<string, []>(),
      getWidth: jest.fn<GoogleAppsScript.Integer, []>(),
      setContent: jest.fn<
        GoogleAppsScript.HTML.HtmlOutput,
        [content: string]
      >(),
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

  const outputWithTitle = emptyHtmlOutput();
  const setTitle = jest
    .fn<GoogleAppsScript.HTML.HtmlOutput, [title: string]>()
    .mockReturnValueOnce(outputWithTitle);
  const outputWithoutTitle = emptyHtmlOutput();
  outputWithoutTitle.setTitle = setTitle;
  const createTemplateFromFile = jest
    .fn<GoogleAppsScript.HTML.HtmlTemplate, [filename: string]>()
    .mockReturnValueOnce({
      evaluate: jest
        .fn<GoogleAppsScript.HTML.HtmlOutput, []>()
        .mockReturnValueOnce(outputWithoutTitle),
      getCode: jest.fn<string, []>(),
      getCodeWithComments: jest.fn<string, []>(),
      getRawContent: jest.fn<string, []>(),
    });
  global.HtmlService = {
    createTemplateFromFile,
  };

  expect(doGet()).toBe(outputWithTitle);
  expect(createTemplateFromFile.mock.calls.length).toBe(1);
  expect(createTemplateFromFile.mock.calls[0][0]).toBe("index");
  expect(setTitle.mock.calls.length).toBe(1);
  expect(setTitle.mock.calls[0][0]).toBe("Shared Drive Mover");
});
