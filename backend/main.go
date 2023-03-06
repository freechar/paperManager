package main

import (
	"main/global"
	Init "main/init"
)

func main() {
	Init.Init()
	Init.DBAutoMigrate()
	global.GGinEngine.Run(":8080")
}
