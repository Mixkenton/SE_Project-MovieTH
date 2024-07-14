export interface PaymentUploadInterface {
  ID?:  number
  bill:   any;
  datetime ?:	Date; 
}
export interface UserInterface{
  ID?:  number
  Username?: string
  Email?: string
  Firstname?: string
  Lastname?: string
  Dob?: Date

 
}

export interface Topic {
  ID: number,
  Topic: string,
  UserID: number,
  TopicID: number,
}
export  interface Report {
  ID: number,
  Description: string,
  UserID: number,
  TopicID: number,
}