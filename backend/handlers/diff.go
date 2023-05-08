package handlers

import (
	// "fmt"
	"main/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CompareDocx(ctx *gin.Context) {
	// 从post拿到两个文件的id
	fileId1 := ctx.PostForm("thesis_file_id_bef")
	fileId2 := ctx.PostForm("thesis_file_id_now")
	// 转换成int
	id1, err := strconv.Atoi(fileId1)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	id2, err := strconv.Atoi(fileId2)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 调用service层的函数
	// 返回diff结果文件的路径
	path, err := service.CompareDocx(uint(id1), uint(id2))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 返回路径
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
		"path":   path,
	})
}

func GetFormat(ctx *gin.Context) {
	// 从get拿到文件的id
	fileId := ctx.Query("thesis_file_id")
	// 转换成int
	id, err := strconv.Atoi(fileId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 调用service层的函数
	res, err := service.Getformat(uint(id))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// fmt.Println(res)
	// 遍历res

	ctx.JSON(http.StatusOK, json{
		"status":"success",
		"msg": "",
		"format": res,
	})

}
