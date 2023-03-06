package handlers

import (
	"main/service"
	"net/http"
	"github.com/gin-gonic/gin"
)
func GetComments(ctx *gin.Context) {
	// 获取用户的id
	userId, exists:=ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK,json{
			"status": "failed",
			"comments":"",
			"msg": "Authorization Error",
		})
		return
	}

	comments,err:=service.GetCommentsByUserId(userId.(uint))
	if err!=nil {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comments":"",
			"msg":err.Error(),
		})
		return 
	}
	ctx.JSON(http.StatusOK,json {
		"status":"success",
		"comments":comments,
		"msg":"",
	})
}