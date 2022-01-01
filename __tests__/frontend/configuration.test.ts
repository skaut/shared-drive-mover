import { stubEndpoints } from "../test-utils/stubEndpoints";

const stubs = stubEndpoints({
  listFolders: (successHandler) => {
    successHandler([]);
  },
  listSharedDrives: (successHandler) => {
    successHandler([]);
  },
  move: (successHandler) => {
    setTimeout(() => {
      successHandler({ status: "success", errors: [] });
    }, 100);
  },
});

it("works with basic configuration", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Copy comments").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("Move").click();
  cy.contains("is moving");
  cy.contains("Done!");
  cy.contains("Successfully moved").then(() => {
    expect(stubs.move).to.have.been.calledOnceWith(
      "root",
      "root",
      false,
      false,
      false
    );
  });
});
