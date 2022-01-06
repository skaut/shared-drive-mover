export type Response<Response, ErrorType extends string> =
  | {
      status: "error";
      type: ErrorType;
    }
  | {
      status: "success";
      response: Response;
    };
