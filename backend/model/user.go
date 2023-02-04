package model
import(
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserType uint
	UserName string
	PassWd string
	Mail string
}