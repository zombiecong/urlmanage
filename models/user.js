var db = require('./db');
// var crypto = require('crypto');

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;

//save
User.prototype.save = function(callback) {
    // var md5 = crypto.createHash('md5');
    //the message
    var user = {
        name: this.name,
        password: this.password
    };
    var users = db.get('users');
    users.insert(user,function(err,doc){
        if (err){
            return callback(err);
        }
        callback(null,doc)
    });
};

//get
User.get = function(id , callback){
    var users = db.get('users');
    users.findOne({ _id: id },function(err,doc){
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, doc);//成功！返回查询的用户信息
    });
}
