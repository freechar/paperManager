from flask import Flask, request, jsonify
from changeCommentAutor import changeCommentAutor
from getComment import get_comments
app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True,port=8081,host='0.0.0.0')

