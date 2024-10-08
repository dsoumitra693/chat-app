import { compareHash, getHash } from "../utils/password";

export class User {
  // Private properties for storing Phone and password
  private Phone: string;
  private password: string;
  private name?: string;

  // // Public property for storing JWT tokens associated with the user
  // public jwt: string[];

  // Constructor to initialize a new User instance with Phone and password
  constructor(Phone: string, password: string, name?: string) {
    this.Phone = Phone;
    this.password = password;
    this.name = name;
  }

  // Method to get the user's Phone
  getPhone(): string {
    return this.Phone;
  }

  // Method to get the user's password (normally not used due to security concerns)
  getPassword(): string {
    return this.password;
  }

  // Method to get the user's password (normally not used due to security concerns)
  getName(): string | undefined {
    return this.name;
  }

  // Method to change the user's password
  // Takes the previous password and new password as arguments
  setPassword(prevPass: string, newPass: string): string {
    // Authenticate with the previous password before setting the new one
    if (this.authenticate(prevPass)) {
      this.password = getHash(newPass);
      return this.password;
    }

    // Throw an error if the previous password does not match
    throw new Error("Password did not match");
  }

  // Method to change the user's Phone
  // Takes the current password and new Phone as arguments
  setPhone(pass: string, newPhone: string): string {
    // Authenticate with the current password before setting the new Phone
    if (this.authenticate(pass)) {
      this.Phone = newPhone;
      return this.Phone;
    }

    // Throw an error if the password does not match
    throw new Error("Password did not match");
  }

  // Method to authenticate the user with a given password
  // Returns true if the password matches the stored password
  authenticate(password: string): boolean {
    return compareHash(password, this.password);
  }
  json() {
    return JSON.stringify(this);
  }
}
