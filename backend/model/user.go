package model
import(
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserType uint	`gorm:"comment:用户类型 0:学生 1:教师 2:管理员"`
	UserName string `gorm:"comment: 用户名"`
	PassWd string	`gorm:"comment:用户密码的加密后"`
	Mail string		`gorm:"comment:用户的电子邮箱;unique"`
	Thesises []ThesisInfo `gorm:"foreignKey:Author"`
	// 当用户为教师的时候需要check的论文
	NeedCheckThesises []*ThesisInfo `gorm:"many2many:checkers_thesises;"`
	// 当用户为教师的时候需要评价的论文
	NeedEvaluateThesises []*ThesisInfo `gorm:"many2many:evaluate_teachers_thesises;"`
}