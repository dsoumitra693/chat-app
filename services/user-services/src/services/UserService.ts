import { KafkaService } from '../kafka';
import { UserRepo } from '../user-repo';

const kafkaService = new KafkaService();
const userRepo = new UserRepo();

/**
 * Service class for managing user-related operations.
 */
export class User {
  private _id: string;
  private _fullname: string;
  private _bio: string;
  private _phone: string;
  private _profilePicture: string;
  private _accountId: string;

  /**
   * Constructor to initialize a new Account instance with phone, password, and ID.
   * @param {string} phone - The phone number associated with the account.
   * @param {string} password - The account password (plain text, to be hashed).
   * @param {string} _id - The unique identifier for the account.
   */
  constructor({
    id,
    fullname,
    bio,
    phone,
    profilePicture,
    accountId,
  }: {
    id: string;
    fullname?: string;
    bio?: string;
    phone: string;
    profilePicture?: string;
    accountId: string;
  }) {
    this._id = id;
    this._fullname = fullname ?? '';
    this._bio = bio ?? '';
    this._phone = phone;
    this._profilePicture = profilePicture ?? '';
    this._accountId = accountId;
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
  get accountId(): string {
    return this._accountId;
  }
  get fullname(): string {
    return this._fullname;
  }
  get bio(): string {
    return this._bio;
  }
  get profilePicture(): string {
    return this._profilePicture;
  }
  /**
   * Getter for the account's unique ID.
   * @returns {string} The unique identifier for the account.
   */
  get id(): string {
    return this._id;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set fullname(fullname: string) {
    this._fullname = fullname;
  }

  set bio(bio: string) {
    this._bio = bio;
  }

  set profilePicture(profilePicture: string) {
    this._profilePicture = profilePicture;
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
    if (id) query.push(`id = '${id}'`);

    if (query.length == 0) throw new Error('Phone or Id is not given.');

    let queryStr = query.join(' OR ');

    let result = await userRepo.getUsers(queryStr);

    if (!result.length) return undefined;

    return new User(result);
  }

  public async delete() {
    return userRepo.deleteUsers(`id = '${this.id}' OR phone = '${this.phone}'`);
  }

  static async delete({ id, phone }: { id?: string; phone?: string }) {
    return userRepo.deleteUsers(`id = '${id}' OR phone = '${phone}'`);
  }

  public async save() {
    kafkaService.produce('user.create', this.phone, {
      ...this,
    });
    return this;
  }

  public async update() {
    kafkaService.produce('user.update', this.phone, {
      ...this,
    });
    return this;
  }
}
