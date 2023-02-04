package model
import(
	"gorm.io/gorm"
)

type evaluate struct {
	gorm.Model
	EvaluateText string
}