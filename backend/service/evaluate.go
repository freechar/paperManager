package service

import (
	"main/global"
	"main/model"
)


func AddEvaluate( ThesisFileId uint, AuthorID uint, EvaluateText string) error {
	db:= global.Gdb
	evaluate := model.Evaluate{
		ThesisFileId: ThesisFileId,
		AuthorID: AuthorID,
		EvaluateText: EvaluateText,
	}
	err := db.Create(&evaluate).Error
	return err
}

