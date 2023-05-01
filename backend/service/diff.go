package service

import (
	"gorm.io/gorm"
	"main/global"
	"main/model"
	"strconv"
)

func CompareDocx(FileIdBef uint, FileIdNow uint) (string, error) {
	//查询数据库， 判断是否存在这个Diff
	//如果存在，直接返回路径
	db := global.Gdb
	// 查询 ThesisFileId

	ThesisFileBef := model.ThesisFile{
		Model: gorm.Model{
			ID: FileIdBef,
		},
	}
	result := db.Model(&ThesisFileBef).Find(&ThesisFileBef)
	if result.Error != nil {
		return "", result.Error
	}

	TheisFileNow := model.ThesisFile{
		Model: gorm.Model{
			ID: FileIdNow,
		},
	}
	result = db.Model(&TheisFileNow).Find(&TheisFileNow)
	if result.Error != nil {
		return "", result.Error
	}

	diff := model.Diff{}
	if err := db.Where("old_thesis_file = ? AND new_thesis_file = ?", FileIdBef, FileIdNow).First(&diff).Error; err != nil {
		//不存在，调用python脚本
		DocxService := NewDocxService()
		//uint 转换成string
		SavePath := strconv.Itoa(int(FileIdBef)) + "-" + strconv.Itoa(int(FileIdNow)) + ".docx"
		err = DocxService.CompareDiff(ThesisFileBef.Path, TheisFileNow.Path, SavePath)
		if err != nil {
			return "", err
		}
		//将路径存入数据库
		diff = model.Diff{
			ThesisId:      ThesisFileBef.ThesisId,
			OldThesisFile: FileIdBef,
			NewThesisFile: FileIdNow,
			DiffFilePath:  SavePath,
		}
		if err := db.Create(&diff).Error; err != nil {
			return "", err
		}
	}
	//存在，直接返回路径
	return diff.DiffFilePath, nil
}
