import { MoviesInterface } from "../fook";
import { UserForLoginInterface } from "../login";

/////////////////////#1//////////////////////////

export interface WatchListInterface {
    ID?: number;
    Name?: string;
    DateTime?: Date;

    UserID?: number;
    User?: UserForLoginInterface;

    CategoriesWatchlistID?: number;
    CategoriesWatchlist?: CategoriesWatchlistInterface;

    ColorID?: number;
    Color?: ColorInterface;
}

export interface WatchListMovieInterface {
    ID?: number;
    
    WatchlistID?: number;
    Watchlist?: WatchListInterface;

    MovieID?: number;
    Movie?: MoviesInterface;
}

export interface ColorInterface {
    ID?: number;
    Color?: string;
}

export interface CategoriesWatchlistInterface {
    ID?: number;
    CategoriesWatchlist?: string;
}

/////////////////////#2/////////////////////

export interface DownloadInterface {
    ID?: number;
    DownloadDate?: Date;

    UserID?: number;
    User?: UserForLoginInterface;

    MovieID?: number;
    Movie?: MoviesInterface;
}