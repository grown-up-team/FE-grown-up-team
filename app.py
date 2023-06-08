from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
import certifi
ca = certifi.where()
client = MongoClient('mongodb+srv://sparta:test@cluster0.uvsfdmm.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta

from bson.objectid import ObjectId
from bson.json_util import dumps

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/detail/<id>', methods=["POST", "GET"])
def detail(id):
    return render_template('detail.html')

# register member
@app.route("/comment/register", methods=["POST"])
def member_post():
    movieId = request.form['movieId']
    reviewer = request.form['reviewer']
    reviewText = request.form['reviewText']
    reviewPWD = request.form['reviewPWD']

    doc = {
        'movieId': movieId,
        'reviewer': reviewer,
        'reviewText': reviewText,
        'reviewPWD': reviewPWD
    }
    db.grown_up_team.insert_one(doc)

    return jsonify({'msg': '저장 완료!'})

# show all members
@app.route("/comment/list", methods=["POST"])
def reviews_get():
    movieId = request.form['movieId']
    all_members = list(db.grown_up_team.find({ "movieId": movieId }))

    result = []
    for member in all_members:
        member['_id'] = str(ObjectId(member['_id']))
        result.append(member)

    return jsonify({'result': result})

# modify chk
@app.route("/comment/updateChk", methods=["POST"])
def modify_chk():
    targetId = request.form['targetUid']
    inputPwd = request.form['inputPwd']
    member = db.grown_up_team.find_one({"_id": ObjectId(targetId)})

    if inputPwd == member['reviewPWD'] : 
        return jsonify({'msg': '수정가능'})
    else :
        return jsonify({'msg': '비밀번호가 틀렸습니다.'})
    
# modify chk
@app.route("/comment/update", methods=["PUT"])
def modify_info():
    targetId = request.form['targetUid']
    reviewText = request.form['reviewText']
    doc = {
        'reviewText': reviewText,
    }
    print(doc)

    db.grown_up_team.update_one({"_id": ObjectId(targetId)}, {"$set" : doc})

    return jsonify({'msg': '수정완료'})

# delete a member
@app.route("/comment/delete", methods=["DELETE"])
def one_member_delete():
    targetId = request.form['targetUid']
    inputPwd = request.form['inputPwd']
    member = db.grown_up_team.find_one({"_id": ObjectId(targetId)})

    if inputPwd == member['reviewPWD'] : 
        db.grown_up_team.delete_one({'_id': ObjectId(targetId)})
        return jsonify({'msg': '삭제 되었습니다.'})
    else :
        return jsonify({'msg': '비밀번호가 틀렸습니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)