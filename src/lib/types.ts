export type SAPayload<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      error: any;
    };
