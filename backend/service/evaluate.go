package service

import (
	"main/global"
	"main/model"
)

func AddEvaluate(ThesisFileId uint, AuthorID uint, EvaluateText string) error {
	db := global.Gdb
	evaluate := model.Evaluate{
		ThesisFileId: ThesisFileId,
		AuthorID:     AuthorID,
		EvaluateText: EvaluateText,
	}
	err := db.Create(&evaluate).Error
	return err
}

func GetEvaluate(ThesisId uint) ([]model.Evaluate, error) {
	db := global.Gdb
	var evaluates []model.Evaluate
	// 通过论文id找到评阅
	var thesisInfo model.ThesisInfo
	err := db.Preload("ThesisFiles.Evaluate").Preload("ThesisFiles.Evaluate.AuthorInfo").Find(&thesisInfo, ThesisId).Error
	if err != nil {
		return nil, err
	}

	for _, thesisFile := range thesisInfo.ThesisFiles {
		evaluates = append(evaluates, thesisFile.Evaluate...)
	}

	return evaluates, err
}
