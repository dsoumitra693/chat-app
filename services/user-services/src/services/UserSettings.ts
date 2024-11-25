import { KafkaService } from '../kafka';
import { UserRepo } from '../user-repo';

const kafkaService = new KafkaService();
const userRepo = new UserRepo();

/**
 * Service class for managing user-related operations.
 */
export class UserSettings {
  private _id: string;
  private _userId: string;
  private _notificationSettings: string;
  private _privacySettings: string;

  /**
   * Constructor to initialize a new Account instance with phone, password, and ID.
   * @param {string} phone - The phone number associated with the account.
   * @param {string} password - The account password (plain text, to be hashed).
   * @param {string} _id - The unique identifier for the account.
   */
  constructor({
    id,
    userId,
    notificationSettings,
    privacySettings,
  }: {
    id: string;
    userId: string;
    notificationSettings: string;
    privacySettings: string;
  }) {
    this._id = id;
    this._userId = userId;
    this._notificationSettings = notificationSettings;
    this._privacySettings = privacySettings;
  }

  /**
   * Getter for the account's password.
   * **Note:** Password should not normally be accessible in plain text.
   * @returns {string} The account's hashed password.
   */
  get notificationSettings(): string {
    return this._notificationSettings;
  }
  get privacySettings(): string {
    return this._privacySettings;
  }
  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }

  set notificationSettings(notificationSettings: string) {
    this._notificationSettings = notificationSettings;
  }
  set privacySettings(privacySettings: string) {
    this._privacySettings = privacySettings;
  }
  set id(id: string) {
    this._id = id;
  }
  set userId(userId: string) {
    this._userId = userId;
  }

  /**
   * Method to return the account's ID as a JSON string.
   * @returns {string} The account's ID in JSON format.
   */
  json(): string {
    return JSON.stringify(this._id);
  }

  static async findOne({ userId }: { userId?: string }) {
    let result = await userRepo.getUserContacts(`user_id = '${userId}'`);

    if (!result.length) return undefined;

    return new UserSettings(result[0]);
  }

  public async delete() {
    return userRepo.deleteUserSettings(`id = '${this.id}'`);
  }

  static async delete({ id }: { id: string }) {
    return userRepo.deleteUserSettings(`id = '${id}'`);
  }

  public async save() {
    kafkaService.produce('usersettings.create', this.id, {
      ...this,
    });
    return this;
  }

  public async update() {
    kafkaService.produce('usersettings.update', this.id, {
      ...this,
    });
    return this;
  }
}
