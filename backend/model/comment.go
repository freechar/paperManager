package model

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	CommentText        string
	QuoteText          string
	ThesisFileId       uint
	AuthorId           uint
	SolvedThesisFileId uint           `gorm:"default:null"`
	Stage              uint           `gorm:"default:0"` // 0:未解决 1:已提交修改 2:已解决
	Replies            []CommentReply `gorm:"foreignKey:CommentId"`
	Author             User           `gorm:"foreignKey:AuthorId"`
}
