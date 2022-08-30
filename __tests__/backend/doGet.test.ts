import { expect, jest, test } from "@jest/globals";

import {
  mockedHtmlOutput,
  mockedHtmlService,
  mockedHtmlTemplate,
} from "../test-utils/gas-stubs";

import { doGet } from "../../src/backend/doGet";

test("doGet works correctly", () => {
  const outputWithTitle = mockedHtmlOutput();
  const setTitle = jest
    .fn<(title: string) => GoogleAppsScript.HTML.HtmlOutput>()
    .mockReturnValueOnce(outputWithTitle);
  const outputWithoutTitle = {
    ...mockedHtmlOutput(),
    setTitle,
  };
  const createTemplateFromFile = jest
    .fn<(filename: string) => GoogleAppsScript.HTML.HtmlTemplate>()
    .mockReturnValueOnce({
      ...mockedHtmlTemplate(),
      evaluate: jest
        .fn<() => GoogleAppsScript.HTML.HtmlOutput>()
        .mockReturnValueOnce(outputWithoutTitle),
    });
  global.HtmlService = {
    ...mockedHtmlService(),
    createTemplateFromFile,
  };

  expect(doGet()).toBe(outputWithTitle);
  expect(createTemplateFromFile.mock.calls).toHaveLength(1);
  expect(createTemplateFromFile.mock.calls[0][0]).toBe("index");
  expect(setTitle.mock.calls).toHaveLength(1);
  expect(setTitle.mock.calls[0][0]).toBe("Shared Drive Mover");
});
