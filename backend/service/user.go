package service

import (
	"fmt"
	"main/global"
	"main/model"
	"main/utils"
	"time"
)
type User struct {
	ID uint
	UserType uint	
	UserName string 
	Mail string		
}
func (r User)Login(email string, password string)(jwtToken string,err error) {
	db := global.Gdb
	user:= model.User{}
	result:=db.Where(&model.User{Mail: email}).First(&user)
	// fmt.Println("userPassWd"+user.PassWd)
	if result.Error!=nil {
		return "", fmt.Errorf(result.Error.Error())
	}
	// fmt.Println("PassHash: "+password)
	// fmt.Println("Passwd: "+user.PassWd)
	if !utils.CheckPasswordHash(password,user.PassWd) {
		
		return "", fmt.Errorf("Invalid email or password")
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

func (r User)Register(passwordStrHash string) (error) {
	db:=global.Gdb
	// 看看mail有没有重复
	user:=model.User{}
	result :=db.Where(&model.User{Mail: r.Mail}).First(&user)
	// 能检索到邮箱
	if result.RowsAffected!=0 {
		return fmt.Errorf("This email has already been registered.")
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