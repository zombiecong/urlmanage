var db = require('./db');

function Url(url) {
    this.link = url.link;
    this.content = url.content;
};

module.exports = Url;

//save
Url.prototype.save = function(callback) {
    var url = {
        link : this.link,
        content : this.content
    };
    var urls = db.get('urls');
    urls.insert(url,function(err,doc){
        if(err) throw err;
        callback()
    });
};

Url.get = function(callback) {
    var urls = db.get('urls');
    urls.find({},{},function(err,docs){
        if(err) throw err;
        callback(err,docs)
    });
}

Url.remove = function(id,callback){
    var urls = db.get('urls');
    urls.remove({ _id: id},function(err){
        if(err) throw err;
        callback()
    }) 
}