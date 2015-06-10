// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/nodetest');

module.exports = db