from flask import Flask, request, jsonify
from getComment import get_comments
app = Flask(__name__)

@app.route('/getComments', methods=['POST'])
def index():
    path = request.form.get('path')
    print(path)
    response = get_comments(path)
    # response = [
    #     {
    #     "AutorName": "admin",
    #     "QuoteText":"This is comment",
    #     "Text": "This Text ",
    #     "Date":"111111111111111111111",
    #     "IsSolved": True,
    # }
    # ]
    return jsonify({
        "comments": response
    })

if __name__ == '__main__':
    app.run(debug=True,port=8081,host='0.0.0.0')

