package model
import(
	"gorm.io/gorm"
)
type Comment struct {
	gorm.Model
	CommentText string
}
