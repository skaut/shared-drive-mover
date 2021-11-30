import { doGet } from "../../src/backend/doGet";

test("doGet works correctly", () => {
  interface HtmlOutput {
    setTitle(title: string): HtmlOutput;
  }
  interface HtmlTemplate {
    evaluate(): HtmlOutput;
  }

  const outputWithTitle: HtmlOutput = {
    setTitle: jest.fn<HtmlOutput, [title: string]>(),
  };
  const setTitle = jest
    .fn<HtmlOutput, [title: string]>()
    .mockReturnValueOnce(outputWithTitle);
  const outputWithoutTitle: HtmlOutput = {
    setTitle,
  };
  const createTemplateFromFile = jest
    .fn<HtmlTemplate, [filename: string]>()
    .mockReturnValueOnce({
      evaluate: jest
        .fn<HtmlOutput, []>()
        .mockReturnValueOnce(outputWithoutTitle),
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
