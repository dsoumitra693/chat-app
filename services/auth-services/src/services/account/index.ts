import { error } from 'console';
import { AccountRepo } from '../../account-repo';
import { accountSchema } from '../../db/schema';
import { produceToKafka } from '../../producers';
import { compareHash, getHash } from '../../utils/password';

const accountRepo = new AccountRepo();

export class Account {
  // Private properties for storing phone and password
  private _phone: string;
  private _password: string;
  private _id: string;

  /**
   * Constructor to initialize a new Account instance with phone, password, and ID.
   * @param {string} phone - The phone number associated with the account.
   * @param {string} password - The account password (plain text, to be hashed).
   * @param {string} _id - The unique identifier for the account.
   */
  constructor(phone: string, password: string, _id: string) {
    this._phone = phone;
    this._password = password;
    this._id = _id;
  }

  /**
   * Getter for the account's phone number.
   * @returns {string} The phone number associated with the account.
   */
  get phone(): string {
    return this._phone;
  }

  /**
   * Getter for the account's password.
   * **Note:** Password should not normally be accessible in plain text.
   * @returns {string} The account's hashed password.
   */
  get password(): string {
    return this._password;
  }

  /**
   * Getter for the account's unique ID.
   * @returns {string} The unique identifier for the account.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Method to change the account's password.
   * Validates the old password before setting a new one.
   * @param {string} prevPass - The previous password for authentication.
   * @param {string} newPass - The new password to be set.
   * @returns {string} The updated (hashed) password.
   * @throws {Error} If the previous password does not match.
   */
  setPassword(prevPass: string, newPass: string): string {
    if (this.authenticate(prevPass)) {
      this._password = getHash(newPass);
      return this.password;
    }
    throw new Error('Password did not match');
  }

  /**
   * Method to change the account's phone number.
   * Validates the password before setting a new phone number.
   * @param {string} pass - The current password for authentication.
   * @param {string} newPhone - The new phone number to be set.
   * @returns {string} The updated phone number.
   * @throws {Error} If the password does not match.
   */
  setPhone(pass: string, newPhone: string): string {
    if (this.authenticate(pass)) {
      this._phone = newPhone;
      return this._phone;
    }
    throw new Error('Password did not match');
  }

  /**
   * Method to authenticate the account with a given password.
   * Compares the given password with the stored hashed password.
   * @param {string} password - The password to be authenticated.
   * @returns {boolean} True if the password matches, false otherwise.
   */
  authenticate(password: string): boolean {
    return compareHash(password, this._password);
  }

  /**
   * Method to return the account's ID as a JSON string.
   * @returns {string} The account's ID in JSON format.
   */
  json(): string {
    return JSON.stringify(this._id);
  }

  static async findOne({ phone, id }: { phone?: string; id?: string }) {
    let query: string[] = [];
    if (phone) query.push(`phone = '${phone}'`);
    if (id) query.push(`id = ${id}`);

    if (query.length == 0) throw new Error('Phone or Id is not given.');

    let queryStr = query.join(' OR ');

    let result = await accountRepo.getAccount(queryStr);

    if(!result.length) return undefined

    return new Account(result[0].phone, result[0].password, result[0].id);
  }

  public async delete() {
    return accountRepo.deleteAccount(
      `id = ${this.id} OR phone = '${this.phone}'`
    );
  }

  public async save() {
    produceToKafka('account.create', this.phone, {
      id: this.id,
      phone: this.phone.toString(),
      password: this.password,
    });
    return this;
  }

  public async update() {
    produceToKafka('account.update', this.phone, {
      id: this.id,
      phone: this.phone,
      password: this.password,
    });
    return this;
  }
}
