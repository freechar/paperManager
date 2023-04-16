package service

import (
	"gorm.io/gorm"
	"main/global"
	"main/model"
	"strconv"
)

func AddThesisFile(ThesisId uint, Path string, SolvedComments []uint) (model.ThesisFile, error) {
	db := global.Gdb
	id := struct {
		LatestVersion uint
		Name          string
	}{}
	var thesisFile model.ThesisFile
	// 这里需要事务
	err := db.Transaction(func(tx *gorm.DB) error {
		// 寻找最新的版本号
		if err := tx.Model(&model.ThesisInfo{}).Find(&id, ThesisId).
			Error; err != nil {
			return err
		}
		// 构建新的ThesisFile
		thesisFile = model.ThesisFile{
			ThesisId: ThesisId,
			Version:  id.LatestVersion,
			Name:     id.Name + " v" + strconv.Itoa(int(id.LatestVersion)+1),
			Path:     Path,
		}
		// 给ThesisFile的SolvedComments赋值
		for _, v := range SolvedComments {
			thesisFile.SolvedComments = append(thesisFile.SolvedComments, model.Comment{
				Model: gorm.Model{
					ID: v,
				},
			})
		}
		// 将solveComment的状态1
		for _, v := range SolvedComments {
			ChangeCommentStageToV2(tx,v,1)
		}

		// 创建
		if err := tx.Create(&thesisFile).Error; err != nil {
			return err
		}
		// 这里要将ThesisInfo的版本号加回去
		if err := tx.Model(&model.ThesisInfo{
			Model: gorm.Model{
				ID: ThesisId,
			},
		}).Updates(model.ThesisInfo{LatestVersion: id.LatestVersion + 1}).
			Error; err != nil {
			return err
		}
		// 添加关联结构
		if err := tx.Model(&model.ThesisInfo{
			Model: gorm.Model{
				ID: ThesisId,
			},
		}).Association("ThesisFiles").Append(&thesisFile); err != nil {
			return err
		}
		// 提交事务
		return nil
	})
	return thesisFile, err
}
func GetThesisFileInfo(thesisFileId uint) (model.ThesisFile, error) {
	db := global.Gdb
	thesisFile := model.ThesisFile{}
	result := db.Model(&model.ThesisFile{}).Find(&thesisFile, thesisFileId)
	return thesisFile, result.Error
}
