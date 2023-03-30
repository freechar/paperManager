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
// 	s := service.DocxService{
// 		Url: "http://127.0.0.1:8081",
// 	}
// 	a, err := s.GetComments("./Save.docx")
// 	if err != nil {
// 		fmt.Println(err.Error())
// 	}
// 	fmt.Println(a)
// }
