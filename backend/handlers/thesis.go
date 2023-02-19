package handlers

import (
	"main/service"
	"net/http"

	"github.com/gin-gonic/gin"
)
type json map[string] interface{} 

func GetThesisesByUser(ctx *gin.Context) {
	// 先拿到用户的ID
	userId, exists:=ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK,json{
			"status": "failed",
			"thesises":"",
			"msg": "Authorization Error",
		})
		return
	}
	// 拿到Thesises
	thesises,err := service.GetThesisesByUserId(userId.(uint))
	if err!=nil {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"thesises":"",
			"msg": err,
		})
		return
	}
	ctx.JSON(http.StatusOK,json{
		"status":"success",
		"msg":"",
		"thesises":thesises,
	})
	return
}