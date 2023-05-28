package init

import (
	"main/global"
	"main/model"
)
type Menu struct {
	UserType uint
	MenuName string
	MenuPath string
	MenuIcon string
}

func InitMenu() {
	menu_list := []Menu{
		{0, "我的论文", "/home/student/mypapers", "user"},
		{0, "待处理意见", "/home/student/commentlist", "mail"},
		{1, "指导的论文", "/home/teacher/cmtpaperlist", "user"},
		{1, "评阅的论文", "/home/teacher/evapaperlist", "mail"},
		{1, "我的意见", "/home/teacher/commentlist", "mail"},
		{1, "待完善信息的论文", "/home/teacher/needtocompletion", "mail"},
		{2, "用户管理", "/home/admin/usermgmt", "user"},
		{2, "论文管理", "/home/admin/papermgmt", "mail"},
	}

	// 对menu进行初始化
	db:=global.Gdb
	for _, menu := range menu_list {
		var count int64
		result:= db.Model(&model.Menu{}).Where("menu_name = ?", menu.MenuName).Count(&count)
		if result.Error != nil {
			panic(result.Error)
		}
		if count == 0 {
			result:= db.Create(&model.Menu{
				UserType: menu.UserType,
				MenuName: menu.MenuName,
				MenuPath: menu.MenuPath,
				Icon: menu.MenuIcon,
			})
			if result.Error != nil {
				panic(result.Error)
			}
		}
	}

}