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
	Stage Stage 	`gorm:"foreignKey:StagesId"`
	ThesisFiles []ThesisFile `gorm:"foreignKey:ThesisId"`
	Diffs []Diff 	`gorm:"foreignKey:ThesisId"`
}