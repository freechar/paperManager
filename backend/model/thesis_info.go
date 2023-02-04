package model
import(
	"gorm.io/gorm"
)
type ThesisInfo struct {
	gorm.Model
	Author uint
	Name string
	StagesId uint
	StagesNow uint
}