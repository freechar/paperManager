package model
import(
	"gorm.io/gorm"
)

type Evaluate struct {
	gorm.Model
	ThesisFileId uint
	EvaluateText string
}