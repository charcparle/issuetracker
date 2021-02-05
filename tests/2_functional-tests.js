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
          //assert.equal(res.body, result);
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
          //assert.equal(res.body, result);
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
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, {error: 'required field(s) missing'});
          done();
        });
  });
});
