package handlers

import (
	"main/service"
	"net/http"

	"github.com/gin-gonic/gin"
)
func GetMenu(ctx *gin.Context) {
	// 获取用户类型
	userId,exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg":"Authorization Error",
		})
		return
	}

	// 通过用户id获取用户类型
	u := service.User{}
	u,err := u.GetUserInfoByID(userId.(uint))
	if err != nil {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg":err.Error(),
		})
		return
	}
	userType := u.UserType
	// 获取菜单
	menus, err := service.GetMenuByUserType(uint(userType))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status":"failed",
			"menus":"",
			"msg":err.Error(),
		})
		return
	}
	// 返回菜单
	ctx.JSON(http.StatusOK, gin.H{
		"status":"success",
		"menus": menus,
		"msg":"",
	})
}