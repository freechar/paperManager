package init

import (
	"main/global"

	"github.com/gin-gonic/gin"
)
var ginEngine *gin.Engine
func InitGinEngine() {
	ginEngine = gin.Default()
	global.GGinEngine = ginEngine
}

