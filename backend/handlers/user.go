package handlers

import (
	"main/service"
	"main/utils"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)

type loginForm struct {
	Email    string `form:"email" binding:"required"`
	Password string `form:"password" binding:"required"`
}

func Login(ctx *gin.Context) {
	var form loginForm
	err := ctx.ShouldBind(&form)
	if err != nil {
		ctx.JSON(http.StatusOK, map[string]interface{}{
			"status": "failed",
			"token":  "",
			"user":   "",
			"msg":    "mail or passwd miss",
		})
		return
	}
	user := service.User{}
	tokenStr, err := user.Login(form.Email, form.Password)
	if err != nil {
		ctx.JSON(http.StatusOK, map[string]interface{}{
			"status": "failed",
			"token":  "",
			"user":   "",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, map[string]interface{}{
		"status": "success",
		"token":  tokenStr,
		"user":   user,
		"msg":    "",
	})
}

type registerForm struct {
	UserType uint   `form:"user_type"`
	UserName string `form:"user_name"`
	PassWd   string `form:"password"`
	Mail     string `form:"mail"`
}

func Register(ctx *gin.Context) {
	var form registerForm
	err := ctx.ShouldBind(&form)
	if err != nil {
		ctx.JSON(http.StatusOK, map[string]interface{}{
			"status": "failed",
			"msg":    "register info miss",
		})
		return
	}
	// 转换密码
	passwordStrHash, err := utils.HashPassword(form.PassWd)
	if err != nil {
		ctx.JSON(http.StatusOK, map[string]interface{}{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	user := service.User{
		UserType: form.UserType,
		UserName: form.UserName,
		Mail:     form.Mail,
	}
	err = user.Register(passwordStrHash)
	if err != nil {
		ctx.JSON(http.StatusOK, map[string]interface{}{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, map[string]interface{}{
		"status": "success",
		"msg":    "",
	})
	return

}

func GetUserInfo(ctx *gin.Context) {
	userId:=ctx.DefaultQuery("user_id","")
	if userId=="" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "user_id is Empty",
		})
		return
	}
	user := service.User{}
	userIdInt,err:=strconv.Atoi(userId)
	if err!=nil{
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	userInfo, err := user.GetUserInfoByID(uint(userIdInt))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK,json{
		"status":"success",
		"msg":"",
		"user_info":userInfo,
	})
}
