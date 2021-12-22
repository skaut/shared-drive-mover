import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";

import StepHeader from "../../src/frontend/StepHeader.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("StepHeader works", () => {
  mockSvelteI18n();
  render(StepHeader, {
    step: "STEP_NAME",
  });
  expect(screen.getByText("steps.STEP_NAME.header")).toBeInTheDocument();
});
