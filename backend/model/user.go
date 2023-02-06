package model
import(
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserType uint	`gorm:"comment:用户类型"`
	UserName string `gorm:"comment: 用户名"`
	PassWd string	`gorm:"comment:用户密码的加密后"`
	Mail string		`gorm:"comment:用户的电子邮箱"`
	Thesises []ThesisInfo `gorm:"foreignKey:Author"`
}