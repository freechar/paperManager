import os
import uuid
import json
def write_to_file(file_path: str, content: str) -> None:
    with open(file_path, "w") as f:
        f.write(content)

def buildExeContent(content: str) -> dict:
    tmp_file_path = "./tmp"+"/getComment"+str(uuid.uuid1())+".docbuilder"
    write_to_file(tmp_file_path, content)
    result = os.popen("onlyoffice-documentbuilder "+tmp_file_path)
    try:
        comments = json.load(result)
        os.remove(tmp_file_path) 
        return comments
    except Exception as e:
        os.remove(tmp_file_path) 
        return dict([("error", str(e)), ("content", result.read())])