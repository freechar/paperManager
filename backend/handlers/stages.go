package handlers

import (
	"main/service"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func AddStages(ctx *gin.Context) {
	addStagesStr := ctx.PostForm("stages")
	if addStagesStr == "" {
		ctx.JSON(200, gin.H{
			"status": "failed",
			"msg":    "stages is empty",
		})
		return
	}
	// split #
	Stages := strings.Split(addStagesStr, "#")

	_, err := service.AddStage(uint(len(Stages)), Stages)
	if err != nil {
		ctx.JSON(200, gin.H{
			"status": "failed",
			"msg":    err.Error(),
		})
	}
	ctx.JSON(200, gin.H{
		"status": "success",
		"msg":    "添加成功",
	})
}

func GetAllStages(ctx *gin.Context) {
	stages, err := service.GetAllStages()
	if err != nil {
		ctx.JSON(200, gin.H{
			"status": "failed",
			"msg":    err.Error(),
		})
	}
	ctx.JSON(200, gin.H{
		"status": "success",
		"stages":    stages,
	})
}
func DelStageById(ctx *gin.Context) {
	stageId := ctx.Param("id")
	if stageId == "" {
		ctx.JSON(200, gin.H{
			"status": "failed",
			"msg":    "id is empty",
		})
		return
	}
	// sting to uint
	 stageId_int, err := strconv.Atoi(stageId)
	 if err != nil {
		ctx.JSON(200, gin.H{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}

	err = service.DelStage(uint(stageId_int))
	if err != nil {
		ctx.JSON(200, gin.H{
			"status": "failed",
			"msg":    err.Error(),
		})
	}
	ctx.JSON(200, gin.H{
		"status": "success",
		"msg":    "删除成功",
	})
}