package handlers

import (
	"main/service"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)


// GetComments retrieves comments for a user.
// It requires the user's ID to be present in the context.
// If the user's ID is not found, it returns an authorization error.
// If there is an error retrieving the comments, it returns the error message.
// Otherwise, it returns the comments successfully.
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

func GetCommentsByThesisId(ctx *gin.Context) {
	// 获取TheisId 从Get请求中获取
	ThesisId:=ctx.Query("thesis_id")
	if ThesisId=="" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comments":"",
			"msg": "thesis_id empty",
		})
		return 
	}
	thesis_id, err := strconv.Atoi(ThesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	comments,err:=service.GetCommentsByThesisId(uint(thesis_id))
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

func GetCommentsSolved(ctx *gin.Context) {
	// 获取 ThesisFileId 从Get请求中获取
	ThesisFileId:=ctx.Query("thesis_file_id")
	if ThesisFileId=="" {
		ctx.JSON(http.StatusOK,json{
			"status":"failed",
			"comments":"",
			"msg": "thesis_file_id empty",
		})
		return 
	}
	thesis_file_id, err := strconv.Atoi(ThesisFileId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}	
	comments,err:= service.GetSubmitedCommentBeforeThesisFileIdByThesisId(uint(thesis_file_id))
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

func CommentHaveSolved(ctx *gin.Context) {
	// 获取 commentId 从Post请求中获取
	commentId:=ctx.PostForm("comment_id")
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
	err=service.ChangeCommentStageTo(uint(comment_id),2)
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
