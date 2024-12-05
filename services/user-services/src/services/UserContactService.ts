import { KafkaService } from '../kafka';
import { UserRepo } from '../user-repo';
import { User } from './UserService';

const kafkaService = new KafkaService();
const userRepo = new UserRepo();

/**
 * Service class for managing user-related operations.
 */
export class UserContact {
  private _id: string;
  private _userId: string;
  private _contactUserId: string;
  private _contactUserProfile: User;

  /**
   * Constructor to initialize a new Account instance with phone, password, and ID.
   * @param {string} phone - The phone number associated with the account.
   * @param {string} password - The account password (plain text, to be hashed).
   * @param {string} _id - The unique identifier for the account.
   */
  constructor({
    id,
    userId,
    contactUserId,
    contactUserProfile,
  }: {
    id: string;
    userId: string;
    contactUserId: string;
    contactUserProfile?: {
      id: string;
      fullname?: string;
      bio?: string;
      phone: string;
      profilePicture?: string;
      accountId: string;
    };
  }) {
    this._id = id;
    this._userId = userId;
    this._contactUserId = contactUserId;
    this._contactUserProfile = new User(contactUserProfile!);
  }

  /**
   * Getter for the account's password.
   * **Note:** Password should not normally be accessible in plain text.
   * @returns {string} The account's hashed password.
   */
  get userId(): string {
    return this._userId;
  }
  get contactUserId(): string {
    return this._contactUserId;
  }
  get id(): string {
    return this._id;
  }

  set userId(userId: string) {
    this._userId = userId;
  }
  set contactUserId(contactUserId: string) {
    this._contactUserId = contactUserId;
  }
  set id(id: string) {
    this._id = id;
  }

  /**
   * Method to return the account's ID as a JSON string.
   * @returns {string} The account's ID in JSON format.
   */
  json(): string {
    return JSON.stringify(this._id);
  }

  static async findOne({ id }: { id?: string }) {
    let result = await userRepo.getUserContacts(`id = '${id}'`);

    if (!result.length) return undefined;

    return new UserContact(result[0]);
  }

  static async find({
    userId,
  }: {
    userId?: string;
  }): Promise<UserContact[] | undefined> {
    let result = await userRepo.getUserContacts(`user_id = '${userId}'`);

    if (!result.length) return undefined;

    let users = result.map(
      (r: {
        id: string;
        userId: string;
        contactUserId: string;
        contactUserProfile: {
          id: string;
          fullname?: string;
          bio?: string;
          phone: string;
          profilePicture?: string;
          accountId: string;
        };
      }) => new UserContact(r)
    );

    return users;
  }

  public async delete() {
    return userRepo.deleteUserContacts(`id = '${this.id}'`);
  }

  static async delete({ id }: { id: string }) {
    return userRepo.deleteUserContacts(`id = '${id}'`);
  }

  public async save() {
    kafkaService.produce('usercontact.create', this.id, {
      ...this,
    });
    return this;
  }

  public async update() {
    kafkaService.produce('usercontact.update', this.id, {
      ...this,
    });
    return this;
  }
}
