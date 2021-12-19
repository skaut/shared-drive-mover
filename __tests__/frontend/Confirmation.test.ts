import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import Confirmation from "../../src/frontend/Confirmation.svelte";
import { mockSvelteI18n } from "../test-utils/mock-svelte-i18n";

jest.mock("svelte-i18n");

test("Confirmation works", () => {
  const svelteI18nRunFn = mockSvelteI18n();
  const { component } = render(Confirmation, {
    sourcePath: [
      { id: "SRC_PATH_ID_1", name: "SRC_PATH_NAME_1" },
      { id: "SRC_PATH_ID_2", name: "SRC_PATH_NAME_2" },
      { id: "SRC_PATH_ID_3", name: "SRC_PATH_NAME_3" },
    ],
    destinationPath: [
      { id: "DEST_PATH_ID_1", name: "DEST_PATH_NAME_1" },
      { id: "DEST_PATH_ID_2", name: "DEST_PATH_NAME_2" },
    ],
    source: { id: "SRC_ID", name: "SRC_NAME" },
    destination: { id: "DEST_ID", name: "DEST_NAME" },
  });
  const onPrevious = jest.fn();
  const onNext = jest.fn();
  component.$on("previous", onPrevious);
  component.$on("next", onNext);
  expect(
    screen.getByText("steps.confirmation.introduction")
  ).toBeInTheDocument();
  expect(screen.getByText("back.buttonLabel")).toBeInTheDocument();
  expect(
    screen.getByText("steps.confirmation.buttonLabel")
  ).toBeInTheDocument();
  expect(svelteI18nRunFn.mock.calls).toHaveLength(4);
  expect(svelteI18nRunFn.mock.calls[0]).toHaveLength(2);
  expect(svelteI18nRunFn.mock.calls[0][1]!.values!.source).toBe(
    "SRC_PATH_NAME_1/SRC_PATH_NAME_2/SRC_PATH_NAME_3/SRC_NAME"
  );
  expect(svelteI18nRunFn.mock.calls[0][1]!.values!.destination).toBe(
    "DEST_PATH_NAME_1/DEST_PATH_NAME_2/DEST_NAME"
  );
  expect(onPrevious.mock.calls).toHaveLength(0);
  expect(onNext.mock.calls).toHaveLength(0);
  userEvent.click(screen.getByText("back.buttonLabel"));
  expect(onPrevious.mock.calls).toHaveLength(1);
  expect(onNext.mock.calls).toHaveLength(0);
  userEvent.click(screen.getByText("steps.confirmation.buttonLabel"));
  expect(onPrevious.mock.calls).toHaveLength(1);
  expect(onNext.mock.calls).toHaveLength(1);
});
