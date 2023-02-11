package handlers

import (
	"main/service"
	"main/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)
type LoginForm struct {
	Email     string `form:"email" binding:"required"`
	Password string `form:"password" binding:"required"`
}
func Login(ctx *gin.Context) {
	var form LoginForm
	err := ctx.ShouldBind(&form)
	if err!= nil {
		ctx.JSON(http.StatusOK, map[string] interface{} {
			"status":"failed",
			"token":"",
			"user":"",
			"msg":"mail or passwd miss",
		}) 
		return
	}
	user:=service.User{}
	tokenStr,err :=user.Login(form.Email, form.Password)
	if err!= nil {
		ctx.JSON(http.StatusOK,map[string] interface{} {
			"status":"failed",
			"token":"",
			"user":"",
			"msg":err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK,map[string] interface{}{
		"status":"success",
		"token":tokenStr,
		"user":user,
		"msg":"",
	})
}

type RegisterForm struct {
	UserType uint	`form:"user_type"`
	UserName string `form:"user_name"`
	PassWd string	`form:"password"`
	Mail string		`form:"mail"`
}

func Register(ctx *gin.Context) {
	var form RegisterForm
	err := ctx.ShouldBind(&form)
	if err != nil {
		ctx.JSON(http.StatusOK,map[string] interface{} {
			"status" :"failed",
			"msg": "register info miss",
		})
		return
	}
	// 转换密码
	passwordStrHash,err := utils.HashPassword(form.PassWd) 
	if err!=nil {
		ctx.JSON(http.StatusOK,map[string] interface {} {
			"status":"failed",
			"msg": err.Error(),
		})
		return
	}
	user:= service.User{
		UserType: form.UserType,
		UserName: form.UserName,
		Mail: form.Mail,
	}
	err=user.Register(passwordStrHash)
	if err!=nil{
		ctx.JSON(http.StatusOK,map[string] interface{}{
			"status":"failed",
			"msg":err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK,map[string]interface{}{
		"status":"success",
		"msg":"",
	})
	return 

}