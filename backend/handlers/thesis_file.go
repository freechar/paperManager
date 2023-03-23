package handlers

import (
	"fmt"
	"main/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetThesisFileInfoById(ctx *gin.Context) {
	// 先拿到id
	thesisFileId := ctx.PostForm("thesis_file_id")
	fmt.Println(ctx.GetPostForm("thesis_file_id"))
	if thesisFileId == "" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg": "thesis_file_id empty",
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
