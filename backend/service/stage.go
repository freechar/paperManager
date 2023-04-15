package service

import (
	"main/global"
	"main/model"
	"strings"
)
func AddStage(Length uint, StageNames []string) (model.Stage,error) {
	db:=global.Gdb
	stageNames:=strings.Join(StageNames,"#")
	stage:=model.Stage{
		Length: Length,
		StageNames: stageNames,
	}
	result:= db.Create(&stage)
	return stage,result.Error
}
func GetAllStages() ([]model.Stage,error) {
	db:=global.Gdb
	var stages []model.Stage
	result:=db.Find(&stages)
	return stages,result.Error
}
func DelStage(stageId uint) error {
	db:=global.Gdb
	result:=db.Delete(&model.Stage{},stageId)
	return result.Error
}
