import { expect, test, vi } from "vitest";

import { doGet } from "../../src/backend/doGet";
import {
  mockedHtmlOutput,
  mockedHtmlService,
  mockedHtmlTemplate,
} from "../test-utils/gas-stubs";

test("doGet works correctly", () => {
  const outputWithTitle = mockedHtmlOutput();
  const outputWithoutTitle = mockedHtmlOutput();
  const setTitle = vi
    .mocked(outputWithoutTitle)
    .setTitle.mockReturnValueOnce(outputWithTitle);
  global.HtmlService = mockedHtmlService();
  const htmlTemplate = mockedHtmlTemplate();
  vi.mocked(htmlTemplate.evaluate).mockReturnValueOnce(outputWithoutTitle);
  const createTemplateFromFile = vi
    .mocked(global.HtmlService)
    .createTemplateFromFile.mockReturnValueOnce(htmlTemplate);

  expect(doGet()).toBe(outputWithTitle);
  expect(createTemplateFromFile.mock.calls).toHaveLength(1);
  expect(createTemplateFromFile.mock.calls[0][0]).toBe("index");
  expect(setTitle.mock.calls).toHaveLength(1);
  expect(setTitle.mock.calls[0][0]).toBe("Shared Drive Mover");
});
