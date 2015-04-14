var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    author:     { type: String },
    body:       { type: String, required: true },
    time:       { type: Date, required: true, default: Date.now },
    points:     { type: Number, required: true, default: 0 },
    comments:    [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

var CommentSchema = new Schema({
    body:       { type: String, required: true },
    time:       { type: Date, required: true, default: Date.now },
    points:     { type: Number, required: true, default: 0 },
    parent:     { type: Schema.Types.ObjectId, ref: 'Post' }
});

exports.Post = mongoose.model('Post', PostSchema);
exports.Comment = mongoose.model('Comment', CommentSchema);
