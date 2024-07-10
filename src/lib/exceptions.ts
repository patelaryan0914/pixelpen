export class AuthRequiredError extends Error {
  constructor(message = "Auth is required to access this page") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
export class BlogNotFound extends Error {
  constructor(message = "Blog Not Found!") {
    super(message);
    this.message = "BlogNotFound";
  }
}
