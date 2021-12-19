import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import Done from "../../src/frontend/Done.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("Done works", () => {
  mockSvelteI18n();
  const { getByText, queryByText } = render(Done, {
    errors: [],
  });
  expect(getByText("steps.done.introduction")).toBeInTheDocument();
  expect(queryByText("steps.done.errors.introduction")).toBeNull();
});

test("Done shows errors", () => {
  mockSvelteI18n();
  const { getByText } = render(Done, {
    errors: [
      {
        file: ["PATH", "TO", "FILE1"],
        error: "ERROR_MESSAGE1",
      },
      {
        file: ["PATH", "TO", "FILE2"],
        error: "ERROR_MESSAGE2",
      },
    ],
  });
  expect(getByText("steps.done.introduction")).toBeInTheDocument();
  expect(getByText("steps.done.errors.introduction")).toBeInTheDocument();
  expect(getByText("PATH/TO/FILE1")).toBeInTheDocument();
  expect(getByText("ERROR_MESSAGE1")).toBeInTheDocument();
  expect(getByText("PATH/TO/FILE2")).toBeInTheDocument();
  expect(getByText("ERROR_MESSAGE2")).toBeInTheDocument();
});
