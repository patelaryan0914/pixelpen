export class AuthRequired extends Error {
  constructor(message = "Authenticated User Can Only Excess This Page") {
    super(message);
    this.message = message;
  }
}

export class BlogNotFound extends Error {
  constructor(message = "Blog Not Found!") {
    super(message);
    this.message = message;
  }
}
