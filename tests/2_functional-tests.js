const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('1# Create an issue with every field', function(done) {
    let submit={
      issue_title: "Test 1 title",
      issue_text: "test 1 issue",
      created_by: "test1by",
      assigned_to: "test1to",
      open: true,
      status_text: "test1 status"
    };
    console.log("running test 1")
    chai.request(server)
        .post('/api/issues/ftests')
        .send(submit)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.typeOf(res.body, 'Object');
          done();
        });
  });

  test('2# Create an issue with only required fields', function(done) {
    let submit={
      issue_title: "Test 2 title",
      issue_text: "test 2 issue",
      created_by: "test2by",
      open: true
    };
    console.log("running test 2")
    chai.request(server)
        .post('/api/issues/ftests')
        .send(submit)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.typeOf(res.body, 'Object');
          done();
        });
  });

  test('3# Create an issue with missing required fields', function(done) {
    let submit={
      issue_title: "Test 3 title",
      issue_text: "test 3 issue",
      open: true
    };
    console.log("running test 3")
    chai.request(server)
        .post('/api/issues/ftests')
        .send(submit)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.body, {"error": 'required field(s) missing'});
          done();
        });
  });

  test('4# View issues on a project: GET request to /api/issues/{project}', function(done) {
    console.log("running test 4")
    chai.request(server)
        .get('/api/issues/ftests')
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.typeOf(res.body, 'array');
          done();
        });
  });

  test('5# View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    console.log("running test 5")
    let filter = {
      issue_title: "Test 2 title"
    }
    let result = [{"assigned_to":"count","status_text":"count","open":true,"_id":"601f4856142a86010b5897a2","issue_title":"wow","issue_text":"hey stop","created_by":"there you","created_on":"2021-02-07T01:54:30.859Z","updated_on":"2021-02-07T01:54:30.859Z"}]
    chai.request(server)
        .get('/api/issues/ftests')
        .end((err, res)=>{
          assert.equal(res.status, 200);
          //assert .equal(res.body, result)
          assert.typeOf(res.body, 'array');
          done();
        });
  });
  /*
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}
  */


});
