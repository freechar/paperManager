package model

import "gorm.io/gorm"

type Menu struct {
	gorm.Model
	UserType uint  `gorm:"comment:用户类型 0:学生 1:教师 2:管理员"`
	MenuName string `gorm:"comment: 菜单名"`
	MenuPath string `gorm:"comment: 菜单路径"`
	Icon string `gorm:"comment: 菜单图标"`
}
