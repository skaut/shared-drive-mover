import { stubEndpoints } from "../test-utils/stubEndpoints";

stubEndpoints({
  listFolders: (successHandler) => {
    setTimeout(() => {
      successHandler({ status: "error", type: "DriveAPIError" });
    }, 100);
  },
  listSharedDrives: (successHandler) => {
    successHandler({
      status: "success",
      response: [
        { id: "ID_DRIVE_1", name: "DRIVE 1" },
        { id: "ID_DRIVE_2", name: "DRIVE 2" },
      ],
    });
  },
});

it("handles raw errors in source folder selection gracefully", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("DRIVE 1").click();
  cy.contains("Continue").click();
  cy.contains("DRIVE 2").dblclick();
  cy.contains("An error occurred").should("be.visible");
  cy.contains("An error occurred in Google Drive").should("be.visible");
});
