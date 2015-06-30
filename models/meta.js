var db = require('./db');

function Meta(meta) {
    this.key = meta.key;
    this.value = meta.value;
};

module.exports = Meta;

Meta.prototype.save = function(callback) {
    var meta = {
        key : this.key,
        value : this.value
    };
    var metas = db.get('metas');
    metas.insert(meta,function(err,doc){
        if(err) throw err;
        callback()
    });
};

Meta.get = function(key ,callback) {
    var metas = db.get('metas');
    metas.findOne({ key: key },function(err,doc){
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, doc);//成功！返回查询的用户信息
    });
}



Meta.update = function(value,callback) {
    var meta = {
        key : 'content',
        value : value
    };

    var metas = db.get('metas');
    metas.update({key: 'content'}, meta,function(err,doc){
        if(err) throw err;
        callback()
    });
};