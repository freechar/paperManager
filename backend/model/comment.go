package model
import(
	"gorm.io/gorm"
)
type Comment struct {
	gorm.Model
	CommentText string
	ThesisFileId uint
	reply []CommentReply	`gorm:"foreignKey:CommentId"`
}
