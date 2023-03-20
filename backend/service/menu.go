package service

import (
	"main/global"
	"main/model"
)

func GetMenuByUserType(UserType uint) ([]model.Menu, error) {
	db := global.Gdb
	// 利用usertype查询菜单
	var menus []model.Menu
	result := db.Where("user_type = ?", UserType).Find(&menus)
	// 返回菜单
	return menus, result.Error
}
