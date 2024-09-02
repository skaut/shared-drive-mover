export type Response<RawResponse, ErrorType extends string> =
  | {
      response: RawResponse;
      status: "success";
    }
  | {
      status: "error";
      type: ErrorType;
    };
