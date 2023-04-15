package service

import (
	"main/global"
	"main/model"
	"gorm.io/gorm"
)

func GetThesisesByUserId(userId uint) (model.User, error) {
	db := global.Gdb
	user := model.User{}
	// 找到用户类型
	result := db.First(&user, userId)
	if result.Error != nil {
		return user, result.Error
	}
	if user.UserType == 0 {
		// 如果是学生
		result = db.Preload("Thesises").Preload("Thesises.Stage").First(&user, userId)
	} else if user.UserType == 1 {
		// 如果是教师
		result = db.Preload("NeedCheckThesises").Preload("NeedCheckThesises.Stage").First(&user, userId)
		// 把NeedCheckThesises赋给Thesises
		for _, thesis := range user.NeedCheckThesises {
			user.Thesises = append(user.Thesises, *thesis)
		}
	}
	return user, result.Error
}

func GetThesisInfoById(thesisId uint) (model.ThesisInfo, error) {
	var thesisInfo model.ThesisInfo
	db := global.Gdb
	db.Preload("ThesisFiles").
		Preload("Checkers").
		Preload("Stage").
		First(&thesisInfo, thesisId)
	return thesisInfo, nil
}

// 添加论文信息

func AddThesisInfo(Author uint, Name string, StagesId uint,
	Introduction string, CheckerIDs []uint, EvaluateTeachers []uint) (model.ThesisInfo, error) {
	db := global.Gdb
	// 先将非关联对象创建出来
	thesisInfo := model.ThesisInfo{
		Author:        Author,
		Name:          Name,
		StagesId:      StagesId,
		StagesNow:     0,
		Introduction:  Introduction,
		LatestVersion: 0,
	}
	// 处理关联关系  只需要添加一个checkers
	var checkers []*model.User
	for _, id := range CheckerIDs {
		user := model.User{}
		user.ID = id
		checkers = append(checkers, &user)
	}
	thesisInfo.Checkers = checkers

	// 处理管理关系 ，添加EvaluateTeachers
	var evaluateTeachers []*model.User
	for _, id := range EvaluateTeachers {
		user := model.User{}
		user.ID = id
		evaluateTeachers = append(evaluateTeachers, &user)
	}
	thesisInfo.EvaluateTeachers = evaluateTeachers
	result := db.Create(&thesisInfo)
	return thesisInfo, result.Error
}

// 更新论文信息
// 论文的阶段 不能修改
func UpdateThesisInfo(thesisId uint, Author uint, Name string,
	Introduction string, CheckerIDs []uint, EvaluateTeachers []uint) (model.ThesisInfo, error) {
	db := global.Gdb
	// 获取到这个对象
	thesisInfo := model.ThesisInfo{}
	result := db.First(&thesisInfo, thesisId)
	if result.Error != nil {
		return thesisInfo, result.Error
	}
	// 更新
	// 这里不判空 默认数据正确无误
	thesisInfo.Author = Author
	thesisInfo.Name = Name
	thesisInfo.Introduction = Introduction
	// 处理关联关系  只需要添加一个checkers
	var checkers []*model.User
	for _, id := range CheckerIDs {
		user := model.User{}
		user.ID = id
		checkers = append(checkers, &user)
	}
	thesisInfo.Checkers = checkers

	// 处理管理关系 ，添加EvaluateTeachers
	var evaluateTeachers []*model.User
	for _, id := range EvaluateTeachers {
		user := model.User{}
		user.ID = id
		evaluateTeachers = append(evaluateTeachers, &user)
	}
	thesisInfo.EvaluateTeachers = evaluateTeachers
	result = db.Save(&thesisInfo)
	return thesisInfo, result.Error
}

func GetAllThesisInfo() ([]model.ThesisInfo, error) {
	db := global.Gdb
	var thesises []model.ThesisInfo
	result := db.Preload("Checkers").Preload("Stage").
		Preload("AuthorUserInfo").Preload("EvaluateTeachers").Find(&thesises)
	return thesises, result.Error
}

func DeleteThesisInfo(thesisId uint) error {
	db := global.Gdb
	// 这里需要事务
	err := db.Transaction(func(tx *gorm.DB) error {
		// 删除论文文件
		thesisFiles := []model.ThesisFile{}
		result := tx.Where("thesis_id = ?", thesisId).Find(&thesisFiles)
		if result.Error != nil {
			return result.Error
		}
		for _, thesisFile := range thesisFiles {
			result = tx.Delete(&thesisFile)
			if result.Error != nil {
				return result.Error
			}
		}
		// 删除论文信息
		thesisInfo := model.ThesisInfo{}
		result = db.First(&thesisInfo, thesisId)
		if result.Error != nil {
			return result.Error
		}
		result = db.Delete(&thesisInfo)
		if result.Error != nil {
			return result.Error
		}
		// 提交事务
		return nil
	})
	return err
}

func UpdateThesisTeacherRef(thesisId uint, checkerTeacher uint, evaluateTeachers []uint) error {
	db := global.Gdb
	// 获取到这个对象
	thesisInfo := model.ThesisInfo{}
	result := db.First(&thesisInfo, thesisId)
	if result.Error != nil {
		return result.Error
	}
	db.Model(&thesisInfo).Association("Checkers").Clear()
	db.Model(&thesisInfo).Association("EvaluateTeachers").Clear()
	// 处理关联关系  只需要添加一个checkers
	var checkers []*model.User
	
	user := model.User{}
	user.ID = checkerTeacher
	checkers = append(checkers, &user)
	thesisInfo.Checkers = checkers

	// 处理管理关系 ，添加EvaluateTeachers
	var evaluateTeacher []*model.User
	for _, id := range evaluateTeachers {
		user := model.User{}
		user.ID = id
		evaluateTeacher = append(evaluateTeacher, &user)
	}
	thesisInfo.EvaluateTeachers = evaluateTeacher
	result = db.Save(&thesisInfo)
	return result.Error
}

func UpdateThesisTitleIntroduction(thesisId uint, title string, introduction string) error {
	db := global.Gdb
	// 获取到这个对象
	thesisInfo := model.ThesisInfo{}
	result := db.First(&thesisInfo, thesisId)
	if result.Error != nil {
		return result.Error
	}
	// 更新
	// 这里不判空 默认数据正确无误
	thesisInfo.Name = title
	thesisInfo.Introduction = introduction
	result = db.Save(&thesisInfo)
	return result.Error
}
func GetThesisInfoByCheckerId(checkerId uint) ([]model.ThesisInfo, error) {
	db := global.Gdb
	u :=model.User{
	}
	result := db.Preload("NeedCheckThesises").Preload("NeedCheckThesises.AuthorUserInfo").Preload("NeedCheckThesises.ThesisFiles").First(&u, checkerId)
	if result.Error != nil {
		return nil, result.Error
	}
	var Thesises []model.ThesisInfo
	for _, thesis := range u.NeedCheckThesises {
		Thesises = append(Thesises, *thesis)
	}
	return Thesises, nil
}