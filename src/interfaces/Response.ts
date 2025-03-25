export type Response<RawResponse, ErrorType extends string> =
  | {
      detail?: string;
      status: "error";
      type: ErrorType;
    }
  | {
      response: RawResponse;
      status: "success";
    };
