package model
import(
	"gorm.io/gorm"
)

type ThesisFile struct {
	gorm.Model
	ThesisId uint
	Version uint
	Name string
	Path string
	Comments []Comment	`gorm:"foreginKey:ThesisFileId"`
	Evaluate Evaluate	`gorm:"foreginKey:ThesisFileId"`
	Diff Diff 	`gorm:"foreignKey:NewThesisFile"`
}