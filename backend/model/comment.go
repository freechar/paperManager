package model
import(
	"gorm.io/gorm"
)
type Comment struct {
	gorm.Model
	CommentText string
	QuoteText string
	ThesisFileId uint
	AuthorId uint
	Replies []CommentReply	`gorm:"foreignKey:CommentId"`
	Author User `gorm:"foreignKey:AuthorId"`
}
