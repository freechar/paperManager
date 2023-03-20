package handlers

import (
	"main/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)
func AddCommentReply(ctx *gin.Context) {
	// 拿到ThesisFileId and AuthorId
	AuthorId, exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"comments": "",
			"msg": "Authorization Error",
		})
		return
	}
	CommentId := ctx.PostForm("comment_id")
	if CommentId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"comments": "",
			"msg": "comment_id empty",
		})
		return
	}
	CommentText := ctx.PostForm("reply_text")
	comment_id, err := strconv.Atoi(CommentId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"comments": "",
			"msg": "comment_id error",
		})
		return
	}
	_, err = service.AddCommentReply(uint(comment_id), AuthorId.(uint), CommentText)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"comments": "",
			"msg": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"comments": "",
		"msg": "",
	})
}