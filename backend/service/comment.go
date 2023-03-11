package service

import (
	"main/global"
	"main/model"
	"time"
)

type resComments struct {
	ThesisName     string
	ThesisFileName string
	CommentText    string
	TeacherName    string
	Time           time.Time
}

func GetCommentsByUserId(userId uint) ([]resComments, error) {
	db := global.Gdb
	u := struct {
		ID       uint
		Thesises []model.ThesisInfo `gorm:"foreignKey:Author"`
	}{}
	result := db.Model(&model.User{}).Preload("Thesises.ThesisFiles.Comments").
		Preload("Thesises.ThesisFiles.Comments.Author").Find(&u, userId)
	if result.Error != nil {
		return nil, result.Error
	}
	var comments []resComments
	for _, thesis := range u.Thesises {
		for _, thesisFile := range thesis.ThesisFiles {
			for _, comment := range thesisFile.Comments {
				comments = append(comments, resComments{
					ThesisName:     thesis.Name,
					ThesisFileName: thesisFile.Name,
					CommentText:    comment.CommentText,
					TeacherName:    comment.Author.UserName,
					Time:           comment.CreatedAt,
				})
			}
		}
	}
	return comments, nil
}

func AddComment(ThesisFileId uint, CommentText string, AuthorId uint) error {
	db := global.Gdb
	comment := model.Comment{
		CommentText:  CommentText,
		ThesisFileId: ThesisFileId,
		AuthorId:     AuthorId,
	}
	result := db.Create(&comment)
	return result.Error
}
