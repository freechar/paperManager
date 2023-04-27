package handlers

import (
	"fmt"
	"main/model"
	"main/service"
	"main/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type json map[string]interface{}

func GetThesisesByUser(ctx *gin.Context) {
	// 先拿到用户的ID
	userId, exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK, json{
			"status":   "failed",
			"thesises": "",
			"msg":      "Authorization Error",
		})
		return
	}
	// 拿到Thesises
	thesises, err := service.GetThesisesByUserId(userId.(uint))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status":   "failed",
			"thesises": "",
			"msg":      err,
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":   "success",
		"msg":      "",
		"thesises": thesises,
	})
}

func GetThesisInfoById(ctx *gin.Context) {
	// 拿到论文的ID
	thesisId := ctx.PostForm("thesis_id")
	if thesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisId is Empty",
		})
		return
	}

	thesisId_int, err := strconv.Atoi(thesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	thesisInfo, err := service.GetThesisInfoById(uint(thesisId_int))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, json{
		"status":      "success",
		"msg":         "",
		"thesis_info": thesisInfo,
	})
}

func GetAllThesisInfo(ctx *gin.Context) {
	// 拿到所有的论文信息
	thesisInfos, err := service.GetAllThesisInfo()
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":       "success",
		"msg":          "",
		"thesis_infos": thesisInfos,
	})
}


func GetThesisInfoNeedToCompletion(ctx *gin.Context) {
	// 获取UserId
	userId, exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "Authorization Error",
		})
		return
	}
	// 获取需要补全的论文信息
	thesisInfos, err := service.GetThesisInfoByCheckerId(userId.(uint))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 筛选Status为0的
	var thesisInfosNeedToCompletion []model.ThesisInfo
	for _, thesisInfo := range thesisInfos {
		if thesisInfo.Status == 0 {
			thesisInfosNeedToCompletion = append(thesisInfosNeedToCompletion, thesisInfo)
		}
	}
	ctx.JSON(http.StatusOK, json{
		"status":       "success",
		"msg":          "",
		"thesis_infos": thesisInfosNeedToCompletion,
	})
	
}

func DelThesisInfoById(ctx *gin.Context) {
	thesisId := ctx.Param("id")
	if thesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisId is Empty",
		})
		return
	}
	thesisId_int, err := strconv.Atoi(thesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	err = service.DeleteThesisInfo(uint(thesisId_int))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})
}

func UpdateThesisTeacherRef(ctx *gin.Context) {
	// 拿到论文ID
	checkerThesisId := ctx.PostForm("thesis_id")
	if checkerThesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisId is Empty",
		})
		return
	}
	thesisId_int, err := strconv.Atoi(checkerThesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 拿到指导教师ID
	teacherId := ctx.PostForm("checker_teacher")
	if teacherId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "teacherId is Empty",
		})
		return
	}
	teacherId_int, err := strconv.Atoi(teacherId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 拿到评阅教师ID
	evaluate_teachersIds := ctx.PostForm("evaluate_teachers")

	if evaluate_teachersIds == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "evaluate_teachersIds is Empty",
		})
		return
	}
	// 将string 解析为 int 数组
	evaluate_teachersIds_int := utils.StringToIntArray(evaluate_teachersIds)
	// 转换为uint
	var evaluate_teachersIds_uint []uint

	for _, v := range evaluate_teachersIds_int {
		evaluate_teachersIds_uint = append(evaluate_teachersIds_uint, uint(v))
	}
	// 更新论文信息
	err = service.UpdateThesisTeacherRef(uint(thesisId_int), uint(teacherId_int), evaluate_teachersIds_uint)
	// fmt.Println(thesisId_int)
	// fmt.Println(teacherId_int)
	// fmt.Println(evaluate_teachersIds_uint)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})
}

func AddThesisInfo(ctx *gin.Context) {
	thesisTitle := ctx.PostForm("thesis_title")
	if thesisTitle == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisTitle is Empty",
		})
		return
	}
	Introduction := ctx.PostForm("introduction")
	if Introduction == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "Introduction is Empty",
		})
		return
	}
	authorId := ctx.PostForm("authorid")
	if authorId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "Author is Empty",
		})
		return
	}
	authorId_int, err := strconv.Atoi(authorId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 拿到指导教师ID
	teacherId := ctx.PostForm("checker_teacher")
	if teacherId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "teacherId is Empty",
		})
		return
	}
	teacherId_int, err := strconv.Atoi(teacherId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 拿到评阅教师ID
	evaluate_teachersIds := ctx.PostForm("evaluate_teachers")
	if evaluate_teachersIds == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "evaluate_teachersIds is Empty",
		})
		return
	}
	// 将string 解析为 int 数组
	evaluate_teachersIds_int := utils.StringToIntArray(evaluate_teachersIds)
	// 转换为uint
	var evaluate_teachersIds_uint []uint
	for _, v := range evaluate_teachersIds_int {
		evaluate_teachersIds_uint = append(evaluate_teachersIds_uint, uint(v))
	}
	// 拿到论文进度
	thesisStages := ctx.PostForm("stages")
	if thesisStages == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisStages is Empty",
		})
		return
	}
	thesisStages_int, err := strconv.Atoi(thesisStages)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	_, err = service.AddThesisInfo(uint(authorId_int), thesisTitle, uint(thesisStages_int),
		Introduction, []uint{uint(teacherId_int)}, evaluate_teachersIds_uint)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})
}

func UpdateThesisInfo(ctx *gin.Context) {
	// 只有标题简介
	thesisId := ctx.PostForm("thesis_id")
	if thesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisId is Empty",
		})
		return
	}
	thesisId_int, err := strconv.Atoi(thesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	thesisTitle := ctx.PostForm("thesis_title")
	if thesisTitle == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisTitle is Empty",
		})
		return
	}
	Introduction := ctx.PostForm("introduction")
	if Introduction == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "Introduction is Empty",
		})
		return
	}
	// 更新论文信息
	err = service.UpdateThesisTitleIntroduction(uint(thesisId_int), thesisTitle, Introduction)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})
}

func ThesisInfnCompletion(ctx * gin.Context) {
	// 拿到ThesisId
	thesisId := ctx.PostForm("thesis_id")
	if thesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisId is Empty",
		})
		return
	}
	thesisId_int, err := strconv.Atoi(thesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	service.ChangeThesisInfoStatusTo(uint(thesisId_int), 1)
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})	
}


func UpdateThesisAuthor(ctx *gin.Context) {
	// 两个参数
	thesisId := ctx.PostForm("thesis_id")
	if thesisId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "thesisId is Empty",
		})
		return
	}
	thesisId_int, err := strconv.Atoi(thesisId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	authorId := ctx.PostForm("author_id")
	if authorId == "" {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    "authorId is Empty",
		})
		return
	}
	authorId_int, err := strconv.Atoi(authorId)
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	// 更新论文信息
	err = service.UpdateThesisAuthor(uint(thesisId_int), uint(authorId_int))
	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
	})
}


func GetThesisInfoByCheckerId(ctx *gin.Context) {
	// 拿到指导教师ID
	userId, exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK, json{
			"status":   "failed",
			"thesises": "",
			"msg":      "Authorization Error",
		})
		return
	}
	// 拿到论文信息
	thesisInfo, err := service.GetThesisInfoByCheckerId(userId.(uint))
	type studentInfo struct {
		StudentId   uint
		StudentName string
		Thesises    []model.ThesisInfo
	}

	// 按照USERID进行分组
	thesisInfoGroupByUserId := make(map[uint]studentInfo)
	for _, v := range thesisInfo {
		// 如果不存在
		if _, ok := thesisInfoGroupByUserId[v.Author]; !ok {
			thesisInfoGroupByUserId[v.Author] = studentInfo{
				StudentId:   v.Author,
				StudentName: v.AuthorUserInfo.UserName,
				Thesises:    []model.ThesisInfo{v},
			}
		} else {
			// 如果存在
			tmp := thesisInfoGroupByUserId[v.Author]
			tmp.Thesises = append(tmp.Thesises, v)
			thesisInfoGroupByUserId[v.Author] = tmp
		}
	}
	fmt.Println(thesisInfoGroupByUserId)
	var studentInfos []studentInfo
	// 遍历map
	for _, v := range thesisInfoGroupByUserId {
		studentInfos = append(studentInfos, v)
	}

	if err != nil {
		ctx.JSON(http.StatusOK, json{
			"status": "failed",
			"msg":    err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status": "success",
		"msg":    "",
		"data":   studentInfos,
	})
}


func GetAllThesisInfoByEvaTeacherId(ctx *gin.Context) {
	// 拿到评阅教师ID
	userId, exists := ctx.Get("UserId")
	if !exists {
		ctx.JSON(http.StatusOK, json{
			"status":   "failed",
			"thesises": "",
			"msg":      "Authorization Error",
		})
		return
	}
	// 拿到论文信息
	thesisInfo, err := service.GetAllThesisInfoByEvaTeacherId(userId.(uint))
	if err!=nil {
		ctx.JSON(http.StatusOK, json{
			"status":   "failed",
			"thesises": "",
			"msg":      err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, json{
		"status":   "success",
		"thesises": thesisInfo,
		"msg":      "",
	})
}