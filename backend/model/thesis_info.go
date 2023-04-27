package model

import (
	"gorm.io/gorm"
)

type ThesisInfo struct {
	gorm.Model
	Author           uint
	Name             string
	StagesId         uint
	StagesNow        uint
	Introduction     string
	LatestVersion    uint
	Status           uint         `gorm:"default:0"` //状态 0:未补完，1:已补完
	Stage            Stage        `gorm:"foreignKey:StagesId"`
	AuthorUserInfo   User         `gorm:"foreignKey:Author"`
	ThesisFiles      []ThesisFile `gorm:"foreignKey:ThesisId"`
	Diffs            []Diff       `gorm:"foreignKey:ThesisId"`
	Checkers         []*User      `gorm:"many2many:checkers_thesises;"`
	EvaluateTeachers []*User      `gorm:"many2many:evaluate_teachers_thesises;"`
}
