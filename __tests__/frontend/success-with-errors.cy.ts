/// <reference types="cypress" />

import { stubEndpoints } from "../test-utils/stubEndpoints";

const stubs = stubEndpoints({
  listFolders: (successHandler) => {
    successHandler({ status: "success", response: [] });
  },
  listSharedDrives: (successHandler) => {
    successHandler({ status: "success", response: [] });
  },
  move: (successHandler) => {
    setTimeout(() => {
      successHandler({
        status: "success",
        response: {
          errors: [
            { file: ["PATH", "TO", "FILE"], error: "ERROR MESSAGE 1" },
            {
              file: ["PATH", "TO", "SECOND", "FILE"],
              error: "ERROR MESSAGE 2",
            },
          ],
        },
      });
    }, 100);
  },
});

it("works and displays moving errors", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").click();
  cy.contains("Continue").click();
  cy.contains('contents of the folder "My Drive" into the folder "My Drive"');
  cy.contains("Move").click();
  cy.contains("Done!");
  cy.contains("errors were encountered");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  cy.get(".mdc-data-table")
    .getTable()
    .should((tableData) => {
      expect(tableData).to.deep.equal([
        { File: "PATH/TO/FILE", "Error message": "ERROR MESSAGE 1" },
        { File: "PATH/TO/SECOND/FILE", "Error message": "ERROR MESSAGE 2" },
      ]);
    });
  cy.contains("Successfully moved").then(() => {
    expect(stubs.move).to.have.been.calledOnceWith(
      "root",
      "root",
      true,
      true,
      false
    );
  });
});
