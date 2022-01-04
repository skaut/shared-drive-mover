import { stubEndpoints } from "../test-utils/stubEndpoints";

stubEndpoints({
  listFolders: (_, failureHandler) => {
    setTimeout(() => {
      failureHandler(new Error("ERROR MESSAGE"));
    }, 100);
  },
  listSharedDrives: (successHandler) => {
    successHandler([]);
  },
});

it("handles errors in destination folder selection gracefully", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").dblclick();
  cy.contains("An error occurred").should("be.visible");
  cy.contains("ERROR MESSAGE");
});
