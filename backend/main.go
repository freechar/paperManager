package main

import (
	// "fmt"
	// "main/global"
	"main/global"
	Init "main/init"
	// "main/service"
)

func main() {
	Init.Init()
	Init.DBAutoMigrate()
	// Test()
	global.GGinEngine.Run(":8080")
}

// func Test() {
// 	u := service.User{}
// 	list,e:= u.GetUserInfoByRole(0)
// 	if e != nil {
// 		fmt.Println(e)
// 	}
// 	fmt.Println(list)
// }
