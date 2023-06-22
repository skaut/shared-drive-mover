import { stubEndpoints } from "../test-utils/stubEndpoints";

stubEndpoints({
  listSharedDrives: (successHandler) => {
    setTimeout(() => {
      successHandler({ status: "error", type: "DriveAPIError" });
    }, 100);
  },
});

it("handles raw errors in source folder selection gracefully", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("An error occurred").should("be.visible");
  cy.contains("An error occurred in Google Drive").should("be.visible");
});
