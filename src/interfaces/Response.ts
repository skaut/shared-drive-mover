export type Response<RawResponse, ErrorType extends string> =
  | {
      status: "error";
      type: ErrorType;
    }
  | {
      status: "success";
      response: RawResponse;
    };
