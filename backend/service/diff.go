package service

import (
	"main/global"
	"main/model"
	"strconv"

	"gorm.io/gorm"
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

func Getformat(ThesisFileId uint) ([]ResDocxFormat, error) {
	db := global.Gdb
	// 查询 ThesisFileId
	tFile := model.ThesisFile{}
	result := db.Model(&model.ThesisFile{}).Where("id = ?", ThesisFileId).First(&tFile)
	if result.Error != nil {
		return nil, result.Error
	}
	// 调用python脚本
	DocxService := NewDocxService()
	res, err := DocxService.GetFormat(tFile.Path)
	if err != nil {
		return nil, err
	}
	return res, nil
}
