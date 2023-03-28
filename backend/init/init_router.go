package init

import (
	"main/handlers"
	"main/middleware"
	"net/http"
)

func IntRouter() {
	r := ginEngine
	r.Use(middleware.Cors())

	// 这部分不需要权限
	r.POST("/login", handlers.Login)
	r.POST("/register", handlers.Register)
	r.POST("/save", handlers.SaveDocx)
	r.StaticFS("/assets", http.Dir("../front/src/assets/"))

	//这部分是需要权限的
	authGroup := r.Group("auth")
	authGroup.Use(middleware.JWTAuth())
	authGroup.GET("/thesises", handlers.GetThesisesByUser)
	authGroup.GET("/userinfo",handlers.GetUserInfo)
	authGroup.POST("/getdocinfo", handlers.GetThesisFileInfoById)
	authGroup.POST("/thesisinfo",handlers.GetThesisInfoById)
	authGroup.GET("/comments",handlers.GetComments)
	authGroup.POST("/comment/add",handlers.AddComment)
	authGroup.POST("/commentreply/add",handlers.AddCommentReply)
	authGroup.POST("/commentinfo",handlers.GetCommentByCommentId)
	authGroup.GET("/menus",handlers.GetMenu)
}
