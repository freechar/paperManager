package init

import "fmt"

import(
	Global "main/global"
	Model "main/model"
)

import (
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
	Global.Gdb = db
	return err
}

func DBAutoMigrate() {
	Global.Gdb.AutoMigrate(
		&Model.Entry.User,
		&Model.Entry.ThesisInfo,
		&Model.Entry.ThesisFile,
		&Model.Entry.Stage,
		&Model.Entry.Evaluate,
		&Model.Entry.Diff,
		&Model.Entry.Comment,
		&Model.Entry.CommentReply,
	)
}

