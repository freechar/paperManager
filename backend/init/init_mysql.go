package init

import (
	"fmt"
	"reflect"

	Global "main/global"

	Model "main/model"

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
	value := reflect.ValueOf(Model.Entry) // coordinate 是一个 Coordinate 实例
	for num := 0; num < value.NumField(); num++ {
		model := value.Field(num).Interface()
		Global.Gdb.AutoMigrate(&model)
	}
}
