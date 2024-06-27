export class AuthRequired extends Error {
  constructor(message = "Authenticated User Can Only Excess This Page") {
    super(message);
    this.message = message;
  }
}
