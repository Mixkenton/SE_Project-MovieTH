package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sut66/team03/controller"
	"github.com/sut66/team03/entity"
	"github.com/sut66/team03/middlewares"
)

//const PORT = "8080"

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.POST("/login", controller.Login)
	//User
	r.POST("user", controller.CreateUser)
	r.GET("/user/:email/:password", controller.GetUserToLogin)
	r.GET("/gender", controller.ListGenders)
	r.GET("/prefix", controller.ListPrefix)
	r.GET("/statususer", controller.ListStatusUser)
	r.GET("/users", controller.ListUser)
	r.DELETE("/user/:id", controller.DeleteUserById)
	r.GET("/userid/:id", controller.GetUserById)
	r.PATCH("/user", controller.UpdateUser)
	r.GET("/subscribes", controller.ListSubscribe)

	//payment
	r.POST("/payment/:UserID/:PackageID", controller.UserPaymentCreate)
	r.GET("/admin/payment", controller.PaymentAdmin)
	r.GET("/admin/payment/:ID", controller.AllowedPayment)
	r.GET("/admin/subscribe/:UserID", controller.UpdateSubscribe)
	r.GET("/admin/payment2/:ID", controller.NotAllowedPayment)
	r.GET("/admin/subscribe2/:UserID", controller.UpdateSubscribe2)
	r.GET("/login/subscribe/:UserID", controller.SubscribeCheck)
	r.GET("payment/:UserID", controller.GetUserbyid)
	r.GET("payment/package/:PackageID", controller.GetPackagebyid)
	
	

	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())
		{
			router.GET("/admin/payment/nameupdate/:ID/:AdminName/:PriceBill", controller.UpdateNameAdmin)
			//report
			router.GET("/report", controller.GetReportTopic)
			router.GET("/report2/:IDTopic", controller.GetReportTopicByID)
			router.POST("/report/create", controller.CreateReportInTopic)
			router.GET("/report/comment/:UserID/:IDTopic", controller.GetReportByUserIDTopicID)
			router.DELETE("/report/comment/delete/:id", controller.DeleteReportByID)
			router.POST("/report/update", controller.UpdateReportByID)

			//Movie for user
			router.GET("/getmoviesbycategories/:cateid", controller.ListMovieByCateId)
			router.GET("/movieforuser/:id", controller.GetMovieByIdForUser)
			router.GET("/moviesforuser", controller.ListMoviesForUser)
			router.GET("/categoriesforuser", controller.ListCategoriesForUser)

			//Watchlist
			r.POST("/watchlists", controller.CreateWatchlist)
			r.GET("/watchlists", controller.ListWatchlist)
			r.PATCH("/watchlists/:id", controller.UpdateWatchlist)
			r.DELETE("/watchlists/:id", controller.DeleteWatchlist)
			r.GET("/watchlists/:id", controller.GetWatchlistByUserID)

			//CategoriesWatchlist
			r.GET("/categories/watchlist", controller.ListCategoriesWatchlist)

			//Color
			r.GET("/color", controller.ListColor)

			//WatchlistMovie
			r.POST("/watchlists/:id/movies/:movieID", controller.AddMovieToWatchlist)
			r.GET("/watchlists/movies/:WatchlistID", controller.GetMoviesInWatchlist)
			r.DELETE("/watchlists/:id/movies/:movieID", controller.DeleteWatchlistMovie)

			//Dowload
			r.POST("/downloads",controller.CreateDownload)
			r.GET("/downloads/:UserID",controller.GetDownloadMovies)
			r.DELETE("/downloads/:id/:movieID",controller.DeleteDownloadMovie)
			r.GET("/downloads/package/:UserID",controller.GetPackageByUserID)


			//UserAccount
			r.GET("/userinfo/:id", controller.GetUserInfo)
			r.PATCH("/userinfo", controller.PatchUserInfo)
			r.PATCH("/userpass", controller.UpdatePass)
			r.POST("/comparePasswords/:id/:enterpass", controller.ComparePasswords)

			//Subscription Management By User
			r.GET("/packages", controller.GetPackageInfo)
			r.GET("/userpackage/:id", controller.GetUserPackageInfo)
			r.GET("/userbill/:id", controller.GetUserBill)
			r.PATCH("/cancelSub/:id", controller.CancelSubscription)

			//Review
			router.GET("/genres", controller.ListGenre)
			router.GET("/ratings", controller.ListRating)
			router.GET("/reviews", controller.ListReview)
			router.GET("/review/:MovieID", controller.GetReviewByMovieID)
			router.GET("/getreview/:UserID/:MovieID", controller.GetReviewByUserID)
			router.POST("/review", controller.CreateReview)
			router.PATCH("/updatereview", controller.UpdateReview)
			router.DELETE("/reviews/:userId/:movieId", controller.DeleteReview)

			//Hitstory
			router.POST("/createHistory", controller.CreateHistory)
			router.GET("/listHistoryByUserId/:UserID", controller.ListHistoryByUserID)
			router.DELETE("/deleteHistory/:userId/:id", controller.DeleteHistoryByMovieID)

			//Movie for admin
			router.DELETE("/movie/:id", controller.DeleteMovieById)
			router.PATCH("/movie", controller.UpdateMovie)
			router.GET("/movie/:id", controller.GetMovieById)
			router.GET("/categories", controller.ListCategories)
			router.GET("/soundtrack", controller.ListSoundtrack)
			router.GET("/target", controller.ListTarget)
			router.POST("/movie", controller.CreateMovie)
			router.GET("/movies", controller.ListMovies)
		}
	}
	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
