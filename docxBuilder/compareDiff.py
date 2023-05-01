from useOnlyOfficeDocumentBuilder import buildExeContent


def diff_document(file_path_bef: str, file_path_now: str,save_name: str) -> dict:
    content = """builder.OpenFile("filePathBef");
var file = builderJS.OpenTmpFile("filePatgNow");
AscCommonWord.CompareDocuments(Api, file, null);
file.Close();
builder.SaveFile("docx", "SaveName");
builder.CloseFile();
"""
    content = content.replace("filePathBef", file_path_bef)
    content = content.replace("filePatgNow", file_path_now)
    content = content.replace("SaveName", save_name)
    # print(content)
    result = buildExeContent(content)
    return result
