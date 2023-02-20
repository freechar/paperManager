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