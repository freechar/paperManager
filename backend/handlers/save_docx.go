package handlers

import (
	"io/ioutil"
	"main/service"
	"main/utils"
	"os"
	"strconv"
	// "fmt"
	simplejson "github.com/bitly/go-simplejson"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func SaveDocx(c *gin.Context) {

	userId := c.Param("userId")
	userIdUint, err := strconv.ParseUint(userId, 10, 64)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}
	thesisFileId := c.Query("thesisFileId")
	// 拿到用户名 通过用户id
	u:= service.User{}
	userInfo, err := u.GetUserInfoByID(uint(userIdUint))
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}


	localPrefix := "../data"

	// 转换为uint
	thesisFileIdUint, err := strconv.ParseUint(thesisFileId, 10, 64)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}

	thesisFileInfo, err := service.GetThesisFileInfo(uint(thesisFileIdUint))
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
			"msg":   err.Error(),
		})
	}
	// 读取json格式的body
	bodyBytes, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}

	// 打印bodyBytes
	// fmt.Println(string(bodyBytes))

	//解析json
	json, err := simplejson.NewJson(bodyBytes)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}
	// 查找json中是否有changesurl
	fileUrl, err := json.Get("url").String()
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
		return
	}

	// 然后用这个来id来保存文件
	// 先把文件保存到本地, 在将文件中的comments全部读取出来
	//将文件保存到本地
	filePath := "/Save/" + thesisFileInfo.Name + ".docx"
	err = utils.DownloadFileToPath(fileUrl, localPrefix+filePath)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
		return
	}
	// 将过去的文件文件的comments读取出来
	s := service.NewDocxService()
	commentsNow, err := s.GetComments(viper.GetString("server_in_onlyoffice.url") + "/data" + filePath)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
		return
	}
	// 将旧的comments读取出来
	commentsOld, err := s.GetComments(viper.GetString("server_in_onlyoffice.url") + "/" + thesisFileInfo.Path)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}
	// 将两个comments进行比较
	type commentsDiff struct {
		QuoteText string
		Text      string
	}
	var Diff []struct {
		QuoteText string
		Text      string
	}
	for _, commentNow := range commentsNow {
		flag := true
		for _, commentOld := range commentsOld {
			if commentNow.QuoteText == commentOld.QuoteText && commentNow.Text == commentOld.Text {
				flag = false
				break
			}
		}
		if flag {
			Diff = append(Diff, commentsDiff{
				QuoteText: commentNow.QuoteText,
				Text:      commentNow.Text,
			})
		}
	}

	// 将Diff转换成json字符串
	jsonDiff, err := simplejson.NewJson([]byte("{}"))
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}
	jsonDiff.Set("changes", Diff)
	jsonDiffString, err := jsonDiff.Encode()
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}

	// 将json字符串传给docxService
	err = s.ChangeCommentsAutor(filePath, string(jsonDiffString), userInfo.UserName)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}

	// 用新的文件替换旧的文件
	err = os.Rename(localPrefix+filePath, thesisFileInfo.Path)
	// fmt.Println(localPrefix+filePath)
	// fmt.Println("../"+thesisFileInfo.Path)
	if err != nil {
		c.JSON(200, gin.H{
			"error": 0,
		})
	}

	// 将comment变化注册到数据库中
	// 因为已经检测过差异了，只要将新的加入到数据库中就可以了
	for _, comment := range Diff {
		err = service.AddComment(uint(thesisFileIdUint), comment.Text, comment.QuoteText, uint(userIdUint))
		if err != nil {
			c.JSON(200, gin.H{
				"error": 0,
			})
		}
	}

	c.JSON(
		200,
		gin.H{
			"error": 0,
		},
	)
}
