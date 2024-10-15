import { compareHash, getHash } from '../utils/password';

export class Account {
  // Private properties for storing Phone and password
  private _phone: string;
  private _password: string;
  private _id:string

  // // Public property for storing JWT tokens associated with the account
  // public jwt: string[];

  // Constructor to initialize a new Account instance with Phone and password
  constructor(phone: string, password: string, _id:string) {
    this._phone = phone;
    this._password = password;
    this._id = _id
  }

  // Method to get the account's Phone
  get phone(): string {
    return this._phone;
  }

  // Method to get the account's password (normally not used due to security concerns)
  get password(): string {
    return this._password;
  }
  get id(): string {
    return this._id;
  }

  // Method to change the account's password
  // Takes the previous password and new password as arguments
  setPassword(prevPass: string, newPass: string): string {
    // Authenticate with the previous password before setting the new one
    if (this.authenticate(prevPass)) {
      this._password = getHash(newPass);
      return this.password;
    }

    // Throw an error if the previous password does not match
    throw new Error('Password did not match');
  }

  // Method to change the account's Phone
  // Takes the current password and new Phone as arguments
  setPhone(pass: string, newPhone: string): string {
    // Authenticate with the current password before setting the new Phone
    if (this.authenticate(pass)) {
      this._phone = newPhone;
      return this._phone;
    }

    // Throw an error if the password does not match
    throw new Error('Password did not match');
  }

  // Method to authenticate the account with a given password
  // Returns true if the password matches the stored password
  authenticate(password: string): boolean {
    return compareHash(password, this._password);
  }
  json() {
    return JSON.stringify(this._id);
  }
}
