/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    
    let testId; //set ID to test with

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'My test book'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'My test book');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.property(res.body, 'comments', 'The book should have comments');
            assert.property(res.body, 'title', 'The book should have a title');
            assert.property(res.body, '_id', 'The book should have an _id');
            done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Title is missing.');
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Response should be an array of books');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            //sets an Id to test with
            testId = res.body[0]._id;
            done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/123456789')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.property(res.body, 'comments', 'Books should have comments');
            assert.property(res.body, 'title', 'Books should have titles');
            assert.property(res.body, '_id', 'Books should have an _id');
            done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testId)
          .send({comment: 'Test'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.include(res.body.comments, 'Test', 'Comments should have test comment submitted');
            assert.property(res.body, 'comments', 'Books should have comments');
            assert.property(res.body, 'title', 'Books should have titles');
            assert.property(res.body, '_id', 'Books should have an _id');
            done();
        });
      });
      
    });

  });

});
