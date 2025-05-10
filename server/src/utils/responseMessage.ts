class ResponseMessage {
  constructor(
    public message: string,
    public response_code: number,
    public isSuccess: boolean,
    public data?: any
  ) {}
}

export { ResponseMessage };
