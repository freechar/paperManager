package handlers

import (
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