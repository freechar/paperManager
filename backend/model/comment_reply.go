package model
import(
	"gorm.io/gorm"
)
type CommentReply struct {
	gorm.Model
	CommentId uint
	ReplyText string
	NextReplyId uint
}