package model

import (
	"gorm.io/gorm"
)

type ThesisFile struct {
	gorm.Model
	ThesisId       uint
	Version        uint
	Name           string
	Path           string
	ThesisInfo     ThesisInfo `gorm:"foreignKey:ThesisId"`
	Comments       []Comment  `gorm:"foreginKey:ThesisFileId"`
	SolvedComments []Comment  `gorm:"foreignKey:SolvedThesisFileId"`
	Evaluate       Evaluate   `gorm:"foreginKey:ThesisFileId"`
	Diff           Diff       `gorm:"foreignKey:NewThesisFile"`
}
