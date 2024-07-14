import { PackageInterface } from "../pool"

export interface UserForLoginInterface{
    ID?:  number
    Username?: string
    Email?: string
    Password?: string
    StatusUser?: StatusUserInterface
}

export interface StatusUserInterface{
    ID?: number
    Status?: string
}

export interface GenderUserInterface{
    ID?: number
    Gender?: string
}

export interface PrefixUserInterface {
    ID?: number
    Prefix?: string
}

export interface UserForRegInterface{
    ID?:  number
    UserName?: string
    Email?: string
    Password?: string
    Firstname?: string
    Lastname?: string
    Address?: string
    Dob?: Date
    StatusUserID?: number
    Gender?: GenderUserInterface
    GenderID?: number
    Prefix?: PrefixUserInterface
    PrefixID?: number
}

export interface UserInterface{
    ID?:  number
    UserName?: string
    Email?: string
    Password?: string
    Firstname?: string
    Lastname?: string
    Address?: string
    Dob?: Date
    StatusUserID?: number
    StatusUser?: StatusUserInterface
    Gender?: GenderUserInterface
    GenderID?: number
    Prefix?: PrefixUserInterface
    PrefixID?: number
}

export interface SubscribeInterface{
    ID?: number
    PackageID?: number
    Package?: PackageInterface
    SubscribeStatusID?: number
    SubscribeStatus?: SubscribeStatusInterface
    UserID?: number
    User?: UserInterface
}

export interface SubscribeStatusInterface{
    ID?: number
    Status?: string
}
export interface LoginInterface {
    Username?: string;
    Password?: string;
  }