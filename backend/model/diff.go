package model
import(
	"gorm.io/gorm"
)

type Diff struct {
	gorm.Model
	ThesisId uint
	OldThesisFile uint
	NewThesisFile uint
}