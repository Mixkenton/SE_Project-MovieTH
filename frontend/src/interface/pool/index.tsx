export interface UserInterface {
    ID?: number
    Username?: string
    Email?: string
    Password?: string
    Firstname?: string
    Lastname?: string
    Address?: string
    Dob?: Date
    Gender?: GenderUserInterface
    GenderID?: number
    Prefix?: PrefixUserInterface
    PrefixID?: number
}

export interface GenderUserInterface {
    ID?: number
    Gender?: string
}

export interface PrefixUserInterface {
    ID?: number
    Prefix?: string
}

export interface PackageInterface {
    ID?: number;
    PackageName?: string;
    Price?: number;
    PackageDetail?: string;
    DownloadStatus?: boolean;
}

export interface Subscription {
    ID?: number
    Created: string | number | Date;
    PackageName?: string;
    Price?: number;
    Bill?: string;
}