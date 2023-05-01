package service

import (
	// "fmt"
	"main/global"
	"main/model"
	"time"

	"gorm.io/gorm"
)

type resComments struct {
	ThesisName     string
	ThesisFileName string
	CommentId      uint
	CommentText    string
	TeacherName    string
	Time           time.Time
	ThesisFileId   uint
}

func GetCommentsByUserId(userId uint) ([]resComments, error) {
	db := global.Gdb
	u := model.User{}
	// 通过id查找到这个user
	result := db.Model(&model.User{}).Find(&u, userId)
	if result.Error != nil {
		return nil, result.Error
	}
	var commentsRes []resComments

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
					commentsRes = append(commentsRes, resComments{
						ThesisName:     thesis.Name,
						ThesisFileName: thesisFile.Name,
						CommentId:      comment.ID,
						CommentText:    comment.CommentText,
						TeacherName:    comment.Author.UserName,
						Time:           comment.CreatedAt,
						ThesisFileId:   comment.ThesisFileId,
					})
				}
			}
		}
	} else if u.UserType == 1 {
		// 在评论中找到AuthorId为userId的评论
		comments := []model.Comment{}
		result = db.Model(&model.Comment{}).Preload("Author").
			Where("author_id = ?", userId).Find(&comments)
		if result.Error != nil {
			return nil, result.Error
		}
		// 通过这个评论找到对应的论文
		for _, comment := range comments {
			thesisFile := model.ThesisFile{}
			result = db.Model(&model.ThesisFile{}).Preload("ThesisInfo").
				Find(&thesisFile, comment.ThesisFileId)
			if result.Error != nil {
				return nil, result.Error
			}
			commentsRes = append(commentsRes, resComments{
				ThesisName:     thesisFile.ThesisInfo.Name,
				ThesisFileName: thesisFile.Name,
				CommentId:      comment.ID,
				CommentText:    comment.CommentText,
				TeacherName:    comment.Author.UserName,
				Time:           comment.CreatedAt,
				ThesisFileId:   comment.ThesisFileId,
			})
		}
		// result = db.Model(&model.User{}).Preload("NeedCheckThesises.ThesisFiles.Comments").
		// 	Preload("NeedCheckThesises.ThesisFiles.Comments.Author").Find(&u, userId)
		// if result.Error != nil {
		// 	return nil, result.Error
		// }
	}
	return commentsRes, nil
}

func AddComment(ThesisFileId uint, CommentText string,
	QuoteText string, AuthorId uint) error {
	db := global.Gdb
	comment := model.Comment{
		CommentText:  CommentText,
		ThesisFileId: ThesisFileId,
		AuthorId:     AuthorId,
		QuoteText:    QuoteText,
	}
	result := db.Create(&comment)
	return result.Error
}

func GetCommentByCommentId(commentId uint) (model.Comment, error) {
	db := global.Gdb
	comment := model.Comment{}
	result := db.Model(&model.Comment{}).
		Preload("Author").
		Preload("Replies").
		Preload("Replies.Author").
		Find(&comment, commentId)
	return comment, result.Error
}

func ChangeCommentStageTo(commentId uint, StageIndex uint) error {
	db := global.Gdb
	result := db.Model(&model.Comment{}).Where("id = ?", commentId).Update("stage", StageIndex)
	return result.Error
}

func ChangeCommentStageToV2(tx *gorm.DB, commentId uint, StageIndex uint) error {
	result := tx.Model(&model.Comment{}).Where("id = ?", commentId).Update("stage", StageIndex)
	return result.Error
}

func DeleteCommentById(commentId uint) error {
	db := global.Gdb
	result := db.Delete(&model.Comment{}, commentId)
	return result.Error
}

func GetCommentsByThesisId(thesisId uint) ([]model.Comment, error) {
	db := global.Gdb
	// fmt.Println(thesisId)
	comments := []model.Comment{}
	// 通过thesisId找到所有的comment
	result := db.Preload("Replies").Preload("Author").Where("solved_thesis_file_id IS NULL AND stage = ?", 0).
		Joins("INNER JOIN thesis_files ON comments.thesis_file_id = thesis_files.id").
		Joins("INNER JOIN thesis_infos ON thesis_files.thesis_id = thesis_infos.id").
		Where("thesis_infos.id = ?", thesisId).Find(&comments)

	return comments, result.Error
}

// 获取状态为1的在ThesisFileId在指定FileId之前的评论
func GetSubmitedCommentBeforeThesisFileIdByThesisId(thesisFileId uint) ([]model.Comment, error) {
	db := global.Gdb
	comments := []model.Comment{}
	
	
	// 获取状态为1的， SolvedThesisFileId存在并且小于给定的thesisFileId，与给定的thesisFileId在同一个论文下的评论
	result := db.Preload("Replies").Preload("Author").
		Where("stage = ? AND solved_thesis_file_id <= ?", 1, thesisFileId).
		Joins("INNER JOIN thesis_files ON comments.thesis_file_id = thesis_files.id").
		Joins("INNER JOIN thesis_infos ON thesis_files.thesis_id = thesis_infos.id").
		Where("thesis_infos.id = (?)", db.Model(&model.ThesisFile{}).Where("id = ?", thesisFileId).
			Select("thesis_id")).
		Find(&comments)
	return comments, result.Error
}
