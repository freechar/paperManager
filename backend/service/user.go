package service

import (
	"fmt"
	"main/global"
	"main/model"
	"main/utils"
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type User struct {
	ID       uint
	UserType uint   `validate:"min=0,max=2"`
	UserName string `validate:"min=1,max=128"`
	Mail     string `validate:"min=1,max=64,email"`
}

func (r *User) GetUserInfoByID(userId uint) (User, error) {
	db := global.Gdb
	user := model.User{}
	result := db.First(&user, userId)
	if result.Error != nil {
		return User{}, result.Error
	}
	userInfo := User{
		ID:       user.ID,
		UserType: user.UserType,
		UserName: user.UserName,
		Mail:     user.Mail,
	}
	r = &userInfo
	return userInfo, nil

}

func (r *User) Login(email string, password string) (jwtToken string, err error) {
	db := global.Gdb
	user := model.User{}
	result := db.Where(&model.User{Mail: email}).First(&user)
	if result.Error != nil {
		return "", fmt.Errorf(result.Error.Error())
	}
	if !utils.CheckPasswordHash(password, user.PassWd) {

		return "", fmt.Errorf("invalid email or password")
	}

	tokenString, err := utils.GenerateToken(user.ID, time.Now().Add(3600*time.Hour))
	if err != nil {
		return "", err
	}
	{
		r.ID = user.ID
		r.UserType = user.UserType
		r.UserName = user.UserName
	}

	return tokenString, err
}

func (r *User) Register(passwordStrHash string) error {
	db := global.Gdb

	validate := validator.New()
	err := validate.Struct(r)
	if err != nil {
		return err
	}

	// 看看mail有没有重复
	user := model.User{}
	result := db.Where(&model.User{Mail: r.Mail}).First(&user)
	// 能检索到邮箱
	if result.RowsAffected != 0 {
		return fmt.Errorf("this email has already been registered")
	}
	// 可以正常注册进去
	user = model.User{
		UserType: r.UserType,
		UserName: r.UserName,
		PassWd:   passwordStrHash,
		Mail:     r.Mail,
	}
	result = db.Create(&user)
	if result.Error != nil {
		return fmt.Errorf(result.Error.Error())
	}
	r.ID = user.ID
	return nil
}

func (r User) GetAllUserInfo() ([]model.User, error) {
	db := global.Gdb
	users := []model.User{}
	result := db.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func (r User) GetAllTeacherInfo() ([]model.User, error) {
	db := global.Gdb
	users := []model.User{}
	result := db.Where(&model.User{UserType: 1}).Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func (r User) GetAllStudentInfo() ([]model.User, error) {
	db := global.Gdb
	users := []model.User{}
	result := db.Where(&model.User{UserType: 0}).Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func (r User) DeleteUserById(userId uint) error {
	db := global.Gdb
	result := db.Delete(&model.User{}, userId)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r User) UpdateUserInfo(userId uint, userName string, passWord string) error {
	db := global.Gdb

	err := db.Transaction(func(tx *gorm.DB) error {
		user := model.User{}
		result := db.First(&user, userId)
		if result.Error != nil {
			return result.Error
		}
		user.UserName = userName
		if passWord != "" {
			user.PassWd = passWord
		}
		result = db.Save(&user)
		if result.Error != nil {
			return result.Error
		}
		return nil
	})
	return err
}

func (r User) GetUserInfoByRole(role uint) ([]model.User, error) {
	db := global.Gdb
	users := []model.User{}
	result := db.Where("user_type = ?", role).Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}