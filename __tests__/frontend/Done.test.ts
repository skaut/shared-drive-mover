import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";

import Done from "../../src/frontend/Done.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("Done works", () => {
  mockSvelteI18n();
  render(Done, {
    errors: [],
  });
  expect(screen.getByText("steps.done.introduction")).toBeInTheDocument();
  expect(screen.queryByText("steps.done.errors.introduction")).toBeNull();
});

test("Done shows errors", () => {
  mockSvelteI18n();
  render(Done, {
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
  expect(screen.getByText("steps.done.introduction")).toBeInTheDocument();
  expect(
    screen.getByText("steps.done.errors.introduction")
  ).toBeInTheDocument();
  expect(screen.getByText("PATH/TO/FILE1")).toBeInTheDocument();
  expect(screen.getByText("ERROR_MESSAGE1")).toBeInTheDocument();
  expect(screen.getByText("PATH/TO/FILE2")).toBeInTheDocument();
  expect(screen.getByText("ERROR_MESSAGE2")).toBeInTheDocument();
});
