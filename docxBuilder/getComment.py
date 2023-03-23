import os
import json
def write_to_file(file_path: str, content: str) -> None:
    with open(file_path, "w") as f:
        f.write(content)

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
        Date: aComments[i].GetTimeUTC(),
        IsSolved: aComments[i].IsSolved(),
    });
}
console.log(JSON.stringify(comments));
"""
    content = content.replace("./Save.docx", file_path)
    write_to_file("./tmp/getComment.docbuilder", content)
    result = os.popen("onlyoffice-documentbuilder ./tmp/getComment.docbuilder")
    comments = json.load(result)
    return comments
# get_comments("./Save.docx")