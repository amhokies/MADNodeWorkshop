var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    body:       { type: String, required: true },
    time:       { type: Date, required: true, default: Date.now },
    points:     { type: Number, required: true, default: 0 },
});

var PostSchema = new Schema({
    author:     { type: String },
    body:       { type: String, required: true },
    time:       { type: Date, required: true, default: Date.now },
    points:     { type: Number, required: true, default: 0 },
    comments:    [CommentSchema]
});

exports.Post = mongoose.model('Post', PostSchema);
