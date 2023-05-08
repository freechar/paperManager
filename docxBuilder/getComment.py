from useOnlyOfficeDocumentBuilder import buildExeContent
import urllib.parse


def get_comments(file_path: str) -> dict:
    content = """builder.OpenFile("./Save.docx"); 
var oDocument = Api.GetDocument(); 
var aComments = oDocument.GetAllComments();
var comments = [];
for (var i = 0; i < aComments.length; i++) {
    comments.push({
        AutorName: aComments[0].GetAutorName(),
        QuoteText: aComments[i].GetQuoteText(),
        Text: aComments[i].GetText(),
        Date: aComments[i].GetTime(),
        IsSolved: aComments[i].IsSolved(),
        ClassType: aComments[i].GetClassType(),
    });
}
console.log(JSON.stringify(comments));
"""
    # 将http://172.17.0.1:8080/data/Save/1 v11.docx进行url转义
    # 切割最后一个/ 取出文件名
    # 将文件名进行url转义
    # 将文件名替换到content中
    url_prefix = file_path[:file_path.rfind('/')]
    url_suffix = file_path[file_path.rfind('/')+1:]
    url_suffix = urllib.parse.quote(url_suffix)
    file_path = url_prefix + '/' + url_suffix
    content = content.replace("./Save.docx", file_path)
    result = buildExeContent(content)
    return result
# result = get_comments("./Save.docx")
# print(result)
