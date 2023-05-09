package handlers

import (
	// "fmt"
	"main/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func AddEvaluate(ctx *gin.Context){
	userId := ctx.GetUint("UserId")
	thesisFileIdStr := ctx.PostForm("thesis_file_id")
	// 转为uint
	thesisFileIdUint,err:= strconv.ParseUint(thesisFileIdStr, 10, 64)
	if err != nil {
		ctx.JSON(200, gin.H{
			"status":"error",
			"msg": err.Error(),
		})
		return
	}
	evaluateText := ctx.PostForm("evaluate_text")
	err= service.AddEvaluate(uint(thesisFileIdUint), userId, evaluateText)
	if err != nil {
		ctx.JSON(200, gin.H{
			"status":"error",
			"msg": err.Error(),
		})
		return
	}
	ctx.JSON(200, gin.H{
		"status":"success",
		"msg": "评阅成功",
	})
}

func GetEvaluate(ctx *gin.Context){
	// 拿到论文id // postform
	thesisIdStr := ctx.Query("thesis_id")
	// fmt.Println(thesisIdStr)
	// 转为uint
	thesisIdUint,err:= strconv.ParseUint(thesisIdStr, 10, 64)
	if err != nil {
		ctx.JSON(200, gin.H{
			"status":"error",
			"msg": err.Error(),
		})
		return
	}
	evaluate,err:= service.GetEvaluate(uint(thesisIdUint))
	if err != nil {
		ctx.JSON(200, gin.H{
			"status":"error",
			"msg": err.Error(),
		})
		return
	}
	ctx.JSON(200, gin.H{
		"status":"success",
		"msg": "获取评阅成功",
		"evaluates": evaluate,
	})
}