// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuccessHandlerType = (value?: any, object?: any) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FailureHandlerType = (error: Error, object?: any) => void;

export function stubEndpoints(
  endpoints: Record<
    string,
    (
      successHandler: SuccessHandlerType,
      failureHandler: FailureHandlerType,
      parameters: Array<google.script.Parameter>,
    ) => void
  >,
): Record<string, sinon.SinonStub> {
  const stubbedEndpoints: Record<string, sinon.SinonStub> = {};
  function endpointFn(
    successHandler: SuccessHandlerType,
    failureHandler: FailureHandlerType,
  ): Record<string, sinon.SinonStub> {
    for (const key in endpoints) {
      stubbedEndpoints[key] = cy.stub().callsFake((...args) => {
        endpoints[key](successHandler, failureHandler, args);
      });
    }
    return stubbedEndpoints;
  }
  Cypress.on("window:before:load", (win) => {
    win.google = {
      script: {
        history: {
          push: cy.stub(),
          replace: cy.stub(),
          setChangeHandler: cy.stub(),
        },
        host: {
          close: cy.stub(),
          setHeight: cy.stub(),
          setWidth: cy.stub(),
          origin: "",
          editor: {
            focus: cy.stub(),
          },
        },
        run: {
          withFailureHandler: cy
            .stub()
            .callsFake((failureHandler: FailureHandlerType) => ({
              withSuccessHandler: cy
                .stub()
                .callsFake((successHandler: SuccessHandlerType) =>
                  endpointFn(successHandler, failureHandler),
                ),
            })),
          withSuccessHandler: cy
            .stub()
            .callsFake((successHandler: SuccessHandlerType) => ({
              withFailureHandler: cy
                .stub()
                .callsFake((failureHandler: FailureHandlerType) =>
                  endpointFn(successHandler, failureHandler),
                ),
            })),
          withUserObject: cy.stub(),
        },
        url: {
          getLocation: cy.stub(),
        },
      },
    };
  });
  return stubbedEndpoints;
}
