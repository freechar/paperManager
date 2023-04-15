package utils

import (
	"strconv"
	"strings"
)

func StringToIntArray(str string) []int {
	str = strings.Replace(str, "[", "", -1)
	str = strings.Replace(str, "]", "", -1)
	strArr := strings.Split(str, ",")
	var intArr []int
	for _, v := range strArr {
		i, _ := strconv.Atoi(v)
		intArr = append(intArr, i)
	}
	return intArr
}
