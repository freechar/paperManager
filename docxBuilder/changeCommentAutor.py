from useOnlyOfficeDocumentBuilder import buildExeContent


def changeCommentAutor(commentNeedToChangeJsonText: str,docxPath: str, newAutorname: str):
    localPrefix = "/root/docxBuilder/data"
    content = """builder.OpenFile("./Save.docx"); 
var diff = """+commentNeedToChangeJsonText+""";
var oDocument = Api.GetDocument(); 
var aComments = oDocument.GetAllComments();
var comments = [];
for (var i = 0; i < aComments.length; i++) {
    for (var j = 0; j < diff["changes"].length; j++) {
        if (aComments[i].GetText() == diff["changes"][j].Text) {
            aComments[i].SetAutorName("""+'"'+newAutorname+'"'+""");
        }
    }
}
builder.SaveFile("docx", "./Save.docx");
console.log(JSON.stringify(comments));
"""
    content = content.replace("./Save.docx", localPrefix+docxPath)
    print(content)
    result = buildExeContent(content)