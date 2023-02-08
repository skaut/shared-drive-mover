import { stubEndpoints } from "../test-utils/stubEndpoints";

const stubs = stubEndpoints({
  listFolders: (successHandler, _, parameters) => {
    switch (parameters[0]) {
      case "root":
        successHandler({
          status: "success",
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_1",
              name: "FOLDER 1 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_2",
              name: "FOLDER 2 IN MY DRIVE",
            },
          ],
        });
        break;
      case "ID_DRIVE_1":
        successHandler({
          status: "success",
          response: [
            {
              id: "ID_DRIVE_1_FOLDER_1",
              name: "FOLDER 1 IN DRIVE 1",
            },
            {
              id: "ID_DRIVE_1_FOLDER_2",
              name: "FOLDER 2 IN DRIVE 1",
            },
          ],
        });
        break;
      case "ID_MY_DRIVE_FOLDER_1":
        successHandler({
          status: "success",
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_1_FOLDER_1",
              name: "FOLDER 1 IN FOLDER 1 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_1_FOLDER_2",
              name: "FOLDER 2 IN FOLDER 1 IN MY DRIVE",
            },
          ],
        });
        break;
      case "ID_MY_DRIVE_FOLDER_2":
        successHandler({
          status: "success",
          response: [
            {
              id: "ID_MY_DRIVE_FOLDER_2_FOLDER_1",
              name: "FOLDER 1 IN FOLDER 2 IN MY DRIVE",
            },
            {
              id: "ID_MY_DRIVE_FOLDER_2_FOLDER_2",
              name: "FOLDER 2 IN FOLDER 2 IN MY DRIVE",
            },
          ],
        });
        break;
    }
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
  move: (successHandler) => {
    setTimeout(() => {
      successHandler({ status: "success", response: { errors: [] } });
    }, 300);
  },
});

it("works with folder selection", () => {
  cy.visit("http://localhost:8080");
  cy.contains("Shared drive mover");
  cy.contains("Continue").click();
  cy.contains("DRIVE 2").dblclick();
  cy.contains("Drive Selection").dblclick();
  cy.contains("DRIVE 1").dblclick();
  cy.contains("FOLDER 2 IN DRIVE 1").click();
  cy.contains("Continue").click();
  cy.contains("My Drive").dblclick();
  cy.contains("FOLDER 2 IN MY DRIVE").dblclick();
  cy.contains("My Drive").click();
  cy.contains("FOLDER 1 IN MY DRIVE").dblclick();
  cy.contains("FOLDER 2 IN FOLDER 1 IN MY DRIVE").click();
  cy.contains("Continue").click();
  cy.contains(
    'contents of the folder "DRIVE 1/FOLDER 2 IN DRIVE 1" into the folder "My Drive/FOLDER 1 IN MY DRIVE/FOLDER 2 IN FOLDER 1 IN MY DRIVE"'
  );
  cy.contains("Move").click();
  cy.contains("is moving");
  cy.contains("Done!");
  cy.contains("Successfully moved").then(() => {
    expect(stubs.move).to.have.been.calledOnceWith(
      "ID_DRIVE_1_FOLDER_2",
      "ID_MY_DRIVE_FOLDER_1_FOLDER_2",
      true,
      true,
      false
    );
  });
});
