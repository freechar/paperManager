package service

import (
	"main/global"
	"main/model"
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



func AddThesisInfo(Author uint, Name string, StagesId uint,
	Introduction string, CheckerIDs []uint) (model.ThesisInfo, error) {
	db:=global.Gdb
		// 先将非关联对象创建出来
	thesisInfo:=model.ThesisInfo{
		Author: Author,
		Name: Name,
		StagesId: StagesId,
		StagesNow: 0,
		Introduction: Introduction,
		LatestVersion: 0,
	}
	// 处理关联关系  只需要添加一个checkers
	var checkers []*model.User
	for _,id:=range CheckerIDs {
		user:=model.User{}
		user.ID=id
		checkers=append(checkers, &user)
	}
	thesisInfo.Checkers=checkers

	result:= db.Create(&thesisInfo)
	return thesisInfo,result.Error
}
