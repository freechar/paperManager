package handlers

import (
	"fmt"
	"io/ioutil"
	"github.com/gin-gonic/gin"
)

func SaveDocx (c *gin.Context) {
	// 这里打印表单
	bodyBytes, err := ioutil.ReadAll(c.Request.Body)
        if err != nil {
			fmt.Println(err.Error())
		}
        fmt.Println(string(bodyBytes))
	c.JSON(200, gin.H{
		"error": 0,
	})
}