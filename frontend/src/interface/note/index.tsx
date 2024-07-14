import { MoviesInterface } from "../fook";
import { UserForLoginInterface,} from "../login";

export interface ReviewInterface{
    ID?:number;
    ReviewText?: string;
	DateTime?: Date ;
    
    UserID?:number;
	User?:UserForLoginInterface;

	MovieID?:number;
	Movie?: MoviesInterface;

	RatingID?:number;
	Rating?:RatingInterface;

	GenreID?:number;
 	Genre?:GenreInterface;

}

export interface RatingInterface{
    ID?:number;
    RatingValue?: number;
}

export interface GenreInterface{
    ID?:number;
    Name?:string;

}

export interface HistoryInterface{
    ID?:number;
	DateTime?: Date ;
    
    UserID?:number;
	User?:UserForLoginInterface;

	MovieID?:number;
	Movie?: MoviesInterface;

	
}