declare namespace google.script {
  const run: Runner;
  type Runner = PublicEndpoints & {
    withFailureHandler(handler: (error: Error, object?: any) => void): Runner;
    withSuccessHandler(handler: (value?: any, object?: any) => void): Runner;
    withUserObject(object: any): Runner;
  };
}
