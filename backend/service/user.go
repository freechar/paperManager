package service

import (
	"fmt"
	"main/global"
	"main/model"
	"main/utils"
	"time"

	"github.com/go-playground/validator/v10"
)
type User struct {
	ID uint
	UserType uint	`validate:"min=0,max=2"`
	UserName string	`validate:"min=1,max=128"` 
	Mail string		`validate:"min=1,max=64,email"`
}

func (r *User) GetUserInfoByID (userId uint ) (User,error) {
	db:=global.Gdb 
	user:=model.User{}
	result:=db.First(&user,userId)
	if result.Error!= nil{
		return User{}, result.Error
	}
	userInfo:= User {
		ID: user.ID,
		UserType: user.UserType,
		UserName: user.UserName,
		Mail: user.Mail,
	}
	r = &userInfo
	return userInfo, nil

}

func (r *User)Login(email string, password string)(jwtToken string,err error) {
	db := global.Gdb
	user:= model.User{}
	result:=db.Where(&model.User{Mail: email}).First(&user)
	if result.Error!=nil {
		return "", fmt.Errorf(result.Error.Error())
	}
	if !utils.CheckPasswordHash(password,user.PassWd) {
		
		return "", fmt.Errorf("invalid email or password")
	}

	tokenString ,err:= utils.GenerateToken(user.ID,time.Now().Add(3600*time.Hour))
	if err != nil {
        return "", err
    }
	{
		r.ID = user.ID
		r.UserType = user.UserType
		r.UserName = user.UserName
	}
	
	return tokenString,err
}

func (r *User)Register(passwordStrHash string) (error) {
	db:=global.Gdb

	validate := validator.New()
    err := validate.Struct(r)
    if err != nil {
        return err
    }

	// 看看mail有没有重复
	user:=model.User{}
	result :=db.Where(&model.User{Mail: r.Mail}).First(&user)
	// 能检索到邮箱
	if result.RowsAffected!=0 {
		return fmt.Errorf("this email has already been registered")
	}
	// 可以正常注册进去
	user = model.User{
		UserType: r.UserType,
		UserName: r.UserName,
		PassWd: passwordStrHash,
		Mail: r.Mail,
	}
	result = db.Create(&user)
	if result.Error!=nil {
		return fmt.Errorf(result.Error.Error())
	}
	r.ID = user.ID
	return nil
}