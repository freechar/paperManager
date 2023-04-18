package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"main/service"
	"main/utils"
	"net/http"
	"strconv"
)

func GetThesisFileInfoById(ctx *gin.Context) {
	// 先拿到id
	thesisFileId := ctx.PostForm("thesis_file_id")
	fmt.Println(ctx.GetPostForm("thesis_file_id"))
	if thesisFileId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesis_file_id empty",
		})
		return
	}
	id, err := strconv.Atoi(thesisFileId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	Info, err := service.GetThesisFileInfo(uint(id))
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
		"Info":   Info,
	})
}

func UploadThesisInfoById(ctx *gin.Context) {
	// 获取ThesisId
	thesisId := ctx.PostForm("thesis_id")
	if thesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesis_id empty",
		})
		return
	}
	id, err := strconv.Atoi(thesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 获取解决的评论
	solvedComment := ctx.PostForm("solved_comment")
	var solvedCommentUintArray []uint
	solvedCommentUintArray = make([]uint, 0)
	if solvedComment != "" {
		// 将解决的评论转换为数组
		solvedCommentArray := utils.StringToIntArray(solvedComment)
		// int数组转换为uint数组
		for _, v := range solvedCommentArray {
			solvedCommentUintArray = append(solvedCommentUintArray, uint(v))
		}
	}

	// 获取文件
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed1",
			"msg":    err.Error(),
		})
		return
	}
	fileNameUuid, err := uuid.NewUUID()
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 重命名
	file.Filename = fileNameUuid.String() + file.Filename
	// 保存文件
	path := "../data/" + file.Filename
	if err := ctx.SaveUploadedFile(file, path); err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed2",
			"msg":    err.Error(),
		})
		return
	}

	_, err = service.AddThesisFile(uint(id), path, solvedCommentUintArray)
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

// 获取已经解决的评论
