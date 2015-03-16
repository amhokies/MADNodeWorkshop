// var express =  require('express');
var mongoose = require('mongoose');
var models = require('./models');

var Post = models.Post;
var Reply = models.Reply;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var db = mongoose.connection;

db.once('open', function (callback) {
    console.log('Connected!!!');

   var newPost = new Post();
   newPost.text = "THIS IS A POST";

   var newReply = new Reply();
   newReply.text = "THIS IS A REPLY";

   newPost.replies.push(newReply);

   newPost.save(function (err) {
      if (err)
        console.log('Error!');
      else {
          console.log('Success!');
      }
   });
});
