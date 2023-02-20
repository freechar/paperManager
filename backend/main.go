package main

import (
	// "fmt"
	"main/global"
	Init "main/init"
	// "main/service"
)

func main() {

	Init.Init()
	Init.DBAutoMigrate()
	// // 创建stage
	// stage, err := service.AddStage(3, []string{"stage1", "stage2", "stage3"})
	// if err != nil {
	// 	return
	// }
	// res, err := service.AddThesisInfo(1,
	// 	"TestPaper", stage.ID,
	// 	"这是测试性的介绍文字", []uint{1})
	// fmt.Println(res)
	// fmt.Println(err)
	global.GGinEngine.Run(":8080")
}
