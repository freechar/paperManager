package init

import "fmt"

func Init()  {
	var err error
	err = initConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal err config file: %s \n", err))
	}

	err = initMySQL()
	if err != nil {
		panic(fmt.Errorf("Fatal err Init: %s \n", err))
	}
	InitMenu()
	initDocxService()
	InitGinEngine()
	IntRouter()
}