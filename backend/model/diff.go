package model
import(
	"gorm.io/gorm"
)

type Diff struct {
	gorm.Model
	OldThesisFile uint
	NewThesisFile uint
}