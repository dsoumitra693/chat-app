export type IFileType = 'Audio' | 'Image' | 'Video' | 'Document' | 'None';
export type IEmojis = '❤️' | '😂' | '😮' | '😢' | '😡' | '👍';
export type IReaction = Map<IEmojis, Number>;
export interface IUser {
  id:string;
  fullname: string;
  phone: string;
  profilePicture?: string;
  bio?:string;
  accoutId:string
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
