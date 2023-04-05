package init

import (
	"main/global"
	"github.com/spf13/viper"
)


func initDocxService() {
	DocxService := global.DocxServiceConf{
		Url: "http://"+viper.GetString("docx_service.host")+":"+viper.GetString("docx_service.port"),
	}
	global.GDocxServiceConf = DocxService
}