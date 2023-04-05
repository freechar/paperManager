from useOnlyOfficeDocumentBuilder import buildExeContent

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
    content = content.replace("./Save.docx", file_path)
    result = buildExeContent(content)
    return result
# result = get_comments("./Save.docx")
# print(result)