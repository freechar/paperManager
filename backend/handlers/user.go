package handlers

import (
	// "fmt"
	"github.com/gin-gonic/gin"
	"main/service"
	"main/utils"
	"net/http"
	"strconv"
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
	UserType uint   `form:"user_type" `
	UserName string `form:"user_name" `
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
	// fmt.Println(form)
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
}

func GetUserInfo(ctx *gin.Context) {
	userId := ctx.DefaultQuery("user_id", "")
	var userIdInt int
	if userId == "" {
		// 如果不存在user_id参数，就从token中获取
		userIdToken, exists := ctx.Get("UserId")
		if !exists {
			ctx.JSON(http.StatusOK, json{
				"status": "failed",
				"msg":    "user_id miss",
			})
			return
		}
		userIdUInt := userIdToken.(uint)
		userIdInt = int(userIdUInt)
	} else {
		var err error
		userIdInt, err = strconv.Atoi(userId)
		if err != nil {
			ctx.JSON(http.StatusOK, json{
				"status": "failed",
				"msg":    err.Error(),
			})
			return
		}
	}
	user := service.User{}

	userInfo, err := user.GetUserInfoByID(uint(userIdInt))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":    "success",
		"msg":       "",
		"user_info": userInfo,
	})
}

func GetMyUserId(ctx *gin.Context) {
	userId, exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "Authorization Error",
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":  "success",
		"msg":     "",
		"user_id": userId.(uint),
	})
}

func GetAllUserInfo(ctx *gin.Context) {
	user := service.User{}
	userInfo, err := user.GetAllUserInfo()
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":    "success",
		"msg":       "",
		"user_info": userInfo,
	})
}

// 使用delete方法删除用户
func DeleteUserById(ctx *gin.Context) {
	userId := ctx.Param("id")
	var userIdInt int
	if userId == "" {
		// user_id参数不存在
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "user_id miss",
		})
		return // 退出函数
	} else {
		var err error
		userIdInt, err = strconv.Atoi(userId)
		if err != nil {
			ctx.JSON(http.StatusOK, json{
				"status": "failed",
				"msg":    err.Error(),
			})
			return
		}
	}
	user := service.User{}
	err := user.DeleteUserById(uint(userIdInt))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})
}

func UpdateUserInfo(ctx *gin.Context) {
	userId := ctx.PostForm("user_id")
	userName := ctx.PostForm("user_name")
	Password := ctx.PostForm("password")

	var userIdInt int
	if userId == "" {
		// user_id参数不存在
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "user_id miss",
		})
		return // 退出函数
	} else {
		var err error
		userIdInt, err = strconv.Atoi(userId)
		if err != nil {
			ctx.JSON(http.StatusOK, json{
				"status": "failed",
				"msg":    err.Error(),
			})
			return
		}
	}
	passwordStrHash := ""
	// 转换密码
	if Password != "" {
		var err error
		passwordStrHash, err = utils.HashPassword(Password)
		if err != nil {
			ctx.JSON(http.StatusOK, map[string]interface{}{
				"status": "failed",
				"msg":    err.Error(),
			})
			return
		}

	}

	user := service.User{}
	err := user.UpdateUserInfo(uint(userIdInt), userName, passwordStrHash)
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
}

func GetUserInfoByRole(ctx *gin.Context) {
	userType := ctx.Param("type")
	var userTypeInt int
	if userType == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "role miss",
		})
		return
	} else {
		var err error
		userTypeInt, err = strconv.Atoi(userType)
		if err != nil {
			ctx.JSON(http.StatusOK, json{
				"status": "failed",
				"msg":    err.Error(),
			})
			return
		}
	}
	user := service.User{}
	userInfo, err := user.GetUserInfoByRole(uint(userTypeInt))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":    "success",
		"msg":       "",
		"user_info": userInfo,
	})
}
