export type IFileType = 'Audio' | 'Image' | 'Video' | 'Document' | 'None';
export type IEmojis = '❤️' | '😂' | '😮' | '😢' | '😡' | '👍';
export type IReaction = Map<IEmojis, Number>;
export interface IUser {
  name: string;
  phone: string;
  displayPicture: string;
}

interface IMessageBase {
  id: string;
  fileType: IFileType;
  timeStamp: Date;
  file: string;
  reactions?: IReaction;
  self: boolean;
  sender: IUser;
}

export type IMessage =
  | (IMessageBase & { fileType: 'None'; text: string }) // fileType is "None", text is required
  | (IMessageBase & { fileType: Exclude<IFileType, 'None'>; text?: string }); // fileType is not "None", text can be optional
