class ResponseError extends Error {
  constructor (code, message) {
    super(message);
    this.type = 'ResponseError';
    this.code = code;
  }
}

export { ResponseError };