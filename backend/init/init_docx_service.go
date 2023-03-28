package init

import (
	"main/global"
	"github.com/spf13/viper"
)


func initDocxService() {
	DocxService := global.DocxServiceConf{
		Url: viper.GetString("http://"+viper.GetString("docx.host")+":"+viper.GetString("docx.port")),
	}
	global.GDocxServiceConf = DocxService

}