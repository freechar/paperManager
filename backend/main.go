package main

import (
	"fmt"

	"main/global"
	"main/model"

	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

)

type MySQLConfig struct {
	Host   string
	DbName string
	Port   int
	User   string
	Passwd string
}

func initMySQL() error {
	config := MySQLConfig{
		Host:   viper.GetString("mysql.host"),
		Passwd: viper.GetString("mysql.password"),
		DbName: viper.GetString("mysql.db_name"),
		Port:   viper.GetInt("mysql.port"),
		User:   viper.GetString("mysql.user"),
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.User,
		config.Passwd,
		config.Host,
		config.Port,
		config.DbName,
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	global.Gdb = db
	return err

}
func Init() error {
	err :=initMySQL()
	return err
}
func DBAutoMigrate() {
	global.Gdb.AutoMigrate(
		&model.Entry.User,
		&model.Entry.ThesisInfo,
		&model.Entry.ThesisFile,
		&model.Entry.Stage,
		&model.Entry.Evaluate,
		&model.Entry.Diff,
		&model.Entry.Comment,
		&model.Entry.CommentReply,
	)
}


func main() {
	viper.SetConfigName("config")
	viper.SetConfigType("json")
	viper.AddConfigPath("config")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal err config file: %s \n", err))
	}

	// init
	err =	Init()
	if err!=nil {
		panic(fmt.Errorf("Fatal err Init: %s \n",err))
	}
	
	DBAutoMigrate()

}
