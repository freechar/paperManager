package model
import(
	"gorm.io/gorm"
)

type Stage struct {
	gorm.Model
	Length uint
	StageNames string
}