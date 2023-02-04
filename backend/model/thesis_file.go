package model
import(
	"gorm.io/gorm"
)

type ThesisFile struct {
	gorm.Model
	ThesisId uint
	Version uint
	Name uint
}