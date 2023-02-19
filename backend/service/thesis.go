package service

import (
	"main/global"
	"main/model"
)
type Thesis struct {
	model.ThesisInfo
	AuthorName string

}

func GetThesisesByUserId(userId uint) (model.User,error) {
	db:=global.Gdb
	user:=model.User{}
	result:=db.First(&user,userId).Preload("Thesises").Find(&user)
	return user, result.Error
}
