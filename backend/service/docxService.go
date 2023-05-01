package service

import (
	"encoding/json"
	"io/ioutil"
	"main/global"
	"net/http"
	"net/url"

	simplejson "github.com/bitly/go-simplejson"
)

type DocxService struct {
	Url string
}

type resDocxComments struct {
	AutorName string
	QuoteText string
	Text      string
	Date      string
	IsSolved  bool
}

func NewDocxService() DocxService {
	return DocxService{
		Url: global.GDocxServiceConf.Url,
	}
}

// 因为只读 所以可以用url文件地址
func (d DocxService) GetComments(path string) ([]resDocxComments, error) {

	apiUrl := d.Url + "/getComments"
	data := url.Values{}
	data.Set("path", path)
	resp, err := http.PostForm(apiUrl, data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	res, err := simplejson.NewJson(body)
	if err != nil {
		return nil, err
	}
	var comments []resDocxComments
	commentsJSON, err := res.Get("comments").Array()
	if err != nil {
		return nil, err
	}
	
	for _, comment := range commentsJSON {
		if each_map, ok := comment.(map[string]interface{}); ok {
			comments = append(comments, resDocxComments{
				AutorName: each_map["AutorName"].(string),
				QuoteText: each_map["QuoteText"].(string),
				Text:      each_map["Text"].(string),
				Date:      each_map["Date"].(json.Number).String(),
				IsSolved:  each_map["IsSolved"].(bool),
			})
		}
	}
	return comments, nil
}

// 需要读写，所以需要具体的文件地址
func (d DocxService) ChangeCommentsAutor(filePath string, commentsDiff string, autorName string) error {
	apiUrl := d.Url + "/changeCommentsAutor"
	data := url.Values{}
	data.Set("path", filePath)
	data.Set("commentNeedToChangeJsonText", commentsDiff)
	data.Set("newAutorname", autorName)
	resp, err := http.PostForm(apiUrl, data)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil
}


// 比较文件
func (d DocxService) CompareDiff(BeforeFilePath string, NowFilePath string ,SavePath string) error {
	apiUrl := d.Url + "/compareDocumentDiff"
	data := url.Values{}
	data.Set("path_before", BeforeFilePath)
	data.Set("path_now", NowFilePath)
	data.Set("path_save", SavePath)
	resp, err := http.PostForm(apiUrl, data)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}
