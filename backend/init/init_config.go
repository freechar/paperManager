package init

import "github.com/spf13/viper"

func initConfig() error {
	viper.SetConfigName("config")
	viper.SetConfigType("json")
	viper.AddConfigPath("config")
	err := viper.ReadInConfig()
	return err
}