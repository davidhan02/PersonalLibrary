/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  //handles api calls for the book list
  app.route('/api/books')
  
    .get(function (req, res){
      //response will be array of book objects
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        let collection = db.collection('books');
        //find book list and change to array
        collection.find().toArray((err, data) => {
          if (err) throw err;
          for (let i = 0; i < data.length; i++) {
            data[i].commentcount = data[i].comments.length;
            //remove comments from the result
            delete data[i].comments;
          }
          res.json(data);
        });
      });
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    //handles posting new book title to db
    .post(function (req, res){
      //take title from body input
      let title = req.body.title;
      if (!title) {
        res.send('Title is missing.');
      } else {
        MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
          if (err) throw err;
          let collection = db.collection('books');
          let format = {title: title, comments: []};
          //insert is similar to save
          collection.insert(format, (err, result) => {
            if (err) throw err;
            res.json(result.ops[0]);
            //response with _id and title
          });
        });
      }
    })
    
    //handles deletion of books from list
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        let collection = db.collection('books');
        //delete collection
        collection.remove();
        res.send('All books deleted');
      });
    });


  //handle calls for specific book ID
  app.route('/api/books/:id')
    
    //get specific book info
    .get(function (req, res){
      //params searches url
      let bookid = req.params.id;
      //convert to mongo object id to search DB
      let objId = new ObjectId(bookid);
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        let collection = db.collection('books');
        collection.find({_id: objId}).toArray((err, data) => {
          if (err) throw err;
          if (!data) {
            res.send('No matching book on record.');
          } else {
            res.json(data[0]);
          }
        });
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    //posting comment to book object
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      let objId = new ObjectId(bookid);
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        let collection = db.collection('books');
        collection.findAndModify(
          {_id: objId},
          {},
          //add comment to object
          {$push: {comments: comment}},
          //don't create new doc if id isn't found
          {new: true, upsert: false},
          (err, result) => {
            if (err) throw err;
            //display value
            res.json(result.value);
          }
        );
      });
      //json res format same as .get
    })
    
    //delete book
    .delete(function(req, res){
      let bookid = req.params.id;
      let objId = new ObjectId(bookid);
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
        if (err) throw err;
        let collection = db.collection('books');
        //delete specified book
        collection.findOneAndDelete({_id: objId}, (err, result) => {
          if (err) throw err;
          res.send('Comment deleted');
        });
      });
    });
  
};
