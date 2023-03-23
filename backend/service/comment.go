package service

import (
	"fmt"
	"main/global"
	"main/model"
	"time"
)

type resComments struct {
	ThesisName     string
	ThesisFileName string
	CommentId      uint
	CommentText    string
	TeacherName    string
	Time           time.Time
}

func GetCommentsByUserId(userId uint) ([]resComments, error) {
	db := global.Gdb
	u := model.User{}
	// 通过id查找到这个user
	result := db.Model(&model.User{}).Find(&u,userId)
	if result.Error != nil {
		return nil, result.Error
	}
	var comments []resComments

	// 判断用户类别
	// 如果是学生，那么就查找他的论文
	if u.UserType == 0 {
		result = db.Model(&model.User{}).Preload("Thesises.ThesisFiles.Comments").
			Preload("Thesises.ThesisFiles.Comments.Author").Find(&u, userId)
		if result.Error != nil {
			return nil, result.Error
		}
		for _, thesis := range u.Thesises {
			for _, thesisFile := range thesis.ThesisFiles {
				for _, comment := range thesisFile.Comments {
					comments = append(comments, resComments{
						ThesisName:     thesis.Name,
						ThesisFileName: thesisFile.Name,
						CommentId:      comment.ID,
						CommentText:    comment.CommentText,
						TeacherName:    comment.Author.UserName,
						Time:           comment.CreatedAt,
					})
				}
			}
		}
	} else if u.UserType == 1 {
		// 如果是教师，那么就查找他需要check的论文
		result = db.Model(&model.User{}).Preload("NeedCheckThesises.ThesisFiles.Comments").
			Preload("NeedCheckThesises.ThesisFiles.Comments.Author").Find(&u, userId)
		if result.Error != nil {
			return nil, result.Error
		}
		fmt.Println(u)
		for _, thesis := range u.NeedCheckThesises {
			for _, thesisFile := range thesis.ThesisFiles {
				for _, comment := range thesisFile.Comments {
					comments = append(comments, resComments{
						ThesisName:     thesis.Name,
						ThesisFileName: thesisFile.Name,
						CommentId:      comment.ID,
						CommentText:    comment.CommentText,
						TeacherName:    comment.Author.UserName,
						Time:           comment.CreatedAt,
					})
				}
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

func GetCommentByCommentId(commentId uint) (model.Comment, error) {
	db := global.Gdb
	comment := model.Comment{}
	result := db.Model(&model.Comment{}).Preload("Author").Preload("Replies").Preload("Replies.Author").Find(&comment, commentId)
	return comment, result.Error
}
