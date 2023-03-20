package service

import (
	"main/global"
	"main/model"
)
func AddCommentReply(commentId uint,AuthorId uint ,replyText string) (model.CommentReply, error) {
	db:=global.Gdb
	commentReply:=model.CommentReply{
		CommentId:commentId,
		ReplyText:replyText,
		AuthorId:AuthorId,
	}
	result:=db.Create(&commentReply)
	return commentReply,result.Error
}

