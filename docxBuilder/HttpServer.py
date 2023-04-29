from flask import Flask, request, jsonify
from changeCommentAutor import changeCommentAutor
from getComment import get_comments
from compareDiff import diff_document
app = Flask(__name__)
localPrefix = "/root/docxBuilder/data/"


@app.route('/getComments', methods=['POST'])
def index():
    path = request.form.get('path')
    print(path)
    response = get_comments(path)
    return jsonify({
        "comments": response
    })

@app.route('/changeCommentsAutor', methods=['POST'])
def changeCommentAutorHandler():
    path = request.form.get('path')
    commentNeedToChangeJsonText = request.form.get('commentNeedToChangeJsonText')
    newAutorname = request.form.get('newAutorname')
    print(path)
    print(commentNeedToChangeJsonText)
    print(newAutorname)
    response = changeCommentAutor(commentNeedToChangeJsonText,path,newAutorname)
    return jsonify({
        "comments": response
    })


@app.route('/compareDocumentDiff', methods=['POST'])
def compareDocumentDiffHandler():
    path_before = request.form.get('path_before')
    path_now = request.form.get('path_now')
    path_save = request.form.get('path_save')
    response = diff_document(localPrefix+path_before, localPrefix+path_now, localPrefix+path_save)

    return jsonify({
        "comments": response
    })


if __name__ == '__main__':
    app.run(debug=True, port=8081, host='0.0.0.0')
