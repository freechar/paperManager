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
	r.POST("/save/:userId", handlers.SaveDocx)
	r.StaticFS("/assets", http.Dir("../front/src/assets/"))
	r.StaticFS("/data", http.Dir("../data"))

	//这部分是需要权限的
	authGroup := r.Group("auth")
	authGroup.Use(middleware.JWTAuth())

	{
		authGroup.GET("/myuserid", handlers.GetMyUserId)
		authGroup.GET("/userinfo", handlers.GetUserInfo)
		authGroup.GET("/getalluserinfo", handlers.GetAllUserInfo)
		authGroup.DELETE("/user/delete/:id", handlers.DeleteUserById)
		authGroup.POST("/user/update", handlers.UpdateUserInfo)
		authGroup.GET("/userinfobyrole/:type", handlers.GetUserInfoByRole)
	}

	{
		authGroup.GET("/thesises", handlers.GetThesisesByUser)
		authGroup.POST("/thesisinfo", handlers.GetThesisInfoById)
		authGroup.GET("/getallthesisinfo", handlers.GetAllThesisInfo)
		authGroup.GET("/getthesisinfobychecker", handlers.GetThesisInfoByCheckerId)
		authGroup.GET("/getthesisinfobyevateacher", handlers.GetAllThesisInfoByEvaTeacherId)
		authGroup.DELETE("/thesis/delete/:id", handlers.DelThesisInfoById)
		authGroup.POST("/thesis/updateteacher", handlers.UpdateThesisTeacherRef)
		authGroup.POST("/thesis/add", handlers.AddThesisInfo)
		authGroup.POST("/thesis/update", handlers.UpdateThesisInfo)
		authGroup.POST("/thesis/updateauthor", handlers.UpdateThesisAuthor)
		authGroup.GET("/thesis/needtocompletion", handlers.GetThesisInfoNeedToCompletion)
		authGroup.POST("/thesis/completion",handlers.ThesisInfnCompletion)
	}
	
	{
		authGroup.POST("/addevaluate", handlers.AddEvaluate)
		authGroup.GET("/eva/all", handlers.GetEvaluate)
	}
	{
		authGroup.POST("/getdocinfo", handlers.GetThesisFileInfoById)
		authGroup.GET("/getthesisIdbyFileId", handlers.GetThesisIdByFileId)
		authGroup.POST("/uploadthesisfile", handlers.UploadThesisInfoById)
	}
	{
		authGroup.GET("/comments", handlers.GetComments)
		authGroup.POST("/comment/add", handlers.AddComment)
		authGroup.DELETE("/comment/delete/:id", handlers.DeleteCommentById)
		authGroup.POST("/commentreply/add", handlers.AddCommentReply)
		authGroup.POST("/commentinfo", handlers.GetCommentByCommentId)
		authGroup.GET("/getcommentsbythesisid", handlers.GetCommentsByThesisId)
		authGroup.GET("/solvedcomments", handlers.GetCommentsSolved)
		authGroup.POST("/solvecomment",handlers.CommentHaveSolved)
	}
	{
		authGroup.GET("/getallstages", handlers.GetAllStages)
		authGroup.POST("/addstages", handlers.AddStages)
		authGroup.DELETE("/delstages/:id",handlers.DelStageById)
	}
	{
		authGroup.POST("/diff",handlers.CompareDocx)
		authGroup.GET("/getformat", handlers.GetFormat)
		authGroup.POST("/stage/next", handlers.StageToNext)

	}
	authGroup.GET("/menus", handlers.GetMenu)

}
