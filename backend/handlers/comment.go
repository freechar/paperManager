package handlers

import (
	"main/service"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)
func GetComments(ctx *gin.Context) {
	// 获取用户的id
	userId, exists:=ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK,json{
			"status": "failed",
			"comments":"",
			"msg": "Authorization Error",
		})
		return
	}
	
	comments,err:=service.GetCommentsByUserId(userId.(uint))
	if err!=nil {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comments":"",
			"msg":err.Error(),
		})
		return 
	}
	ctx.JSON(http.StatusOK,json {
		"status":"success",
		"comments":comments,
		"msg":"",
	})
}

func AddComment(ctx *gin.Context) {
	// 拿到ThesisFileId and AuthorId
	AuthorId,exists:= ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comments":"",
			"msg": "Authorization Error",
		})
		return  
	}
	ThesisFileId:=ctx.PostForm("thesis_file_id")
	if ThesisFileId=="" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comments":"",
			"msg": "thesis_file_id empty",
		})
		return 
	}
	CommentText:=ctx.PostForm("comment_text")
	thesis_file_id, err := strconv.Atoi(ThesisFileId)

	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 不允许前端直接去添加含有QuoteText的comment
	service.AddComment(uint(thesis_file_id),CommentText,"",AuthorId.(uint))
}
func GetCommentByCommentId(ctx *gin.Context) {
	commentId:=ctx.PostForm("comment_id")
	if commentId=="" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comment":"",
			"msg": "comment_id empty",
		})
		return 
	}
	comment_id, err := strconv.Atoi(commentId)

	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	comment,err:=service.GetCommentByCommentId(uint(comment_id))
	if err!=nil {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comment":"",
			"msg":err.Error(),
		})
		return 
	}
	ctx.JSON(http.StatusOK,json {
		"status":"success",
		"comment":comment,
		"msg":"",
	})
}

func DeleteCommentById(ctx *gin.Context) {
	commentId := ctx.Param("id")
	if commentId=="" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg": "comment_id empty",
		})
		return 
	}
	comment_id, err := strconv.Atoi(commentId)

	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	err=service.DeleteCommentById(uint(comment_id))
	if err!=nil {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"msg":err.Error(),
		})
		return 
	}
	ctx.JSON(http.StatusOK,json {
		"status":"success",
		"msg":"",
	})
}