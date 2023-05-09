package model
import(
	"gorm.io/gorm"
)

type Evaluate struct {
	gorm.Model
	ThesisFileId uint
	AuthorID uint
	AuthorInfo User `gorm:"foreignKey:AuthorID"`
	EvaluateText string
}