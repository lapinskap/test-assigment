export default class ApiResponseError extends Error {
  constructor(status, url, error, message) {
    super(`${error} Request ${url} resturn status ${status}. Reason: ${message}`);
    this.status = status;
    this.error = error;
    this.message = message;
  }
}
