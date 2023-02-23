package handlers

import (
	"main/service"
	"net/http"
	"strconv"
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


func GetThesisInfoById(ctx *gin.Context){
	// 拿到论文的ID
	thesisId := ctx.PostForm("thesis_id")
	if thesisId=="" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg":"thesisId is Empty",
		})
		return 
	}

	thesisId_int,err:= strconv.Atoi(thesisId)
	if err!=nil{
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg":err.Error(),
			
		})
		return
	}
	thesisInfo,err:= service.GetThesisInfoById(uint(thesisId_int))
	if err!=nil{
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg":err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK,json{
		"status":"success",
		"msg":"",
		"thesis_info":thesisInfo,
	})
	return
	
}