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
          assert.deepEqual(res.body, {"error": 'required field(s) missing'});
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
      created_by: "fCC"
    }
    let result = [
        {
        "assigned_to": "",
        "status_text": "",
        "open": true,
        "_id": "601c0cd132fe6000dbfd99f4",
        "issue_title": "Faux Issue Title",
        "issue_text": "Functional Test - Required Fields Only",
        "created_by": "fCC",
        "created_on": "2021-02-04T15:03:45.304Z",
        "updated_on": "2021-02-04T15:03:45.304Z"
        },
        {
        "assigned_to": "Chai and Mocha",
        "status_text": "",
        "open": true,
        "_id": "601c0cd132fe6000dbfd99f5",
        "issue_title": "Faux Issue Title 2",
        "issue_text": "Functional Test - Every field filled in",
        "created_by": "fCC",
        "created_on": "2021-02-04T15:03:45.596Z",
        "updated_on": "2021-02-04T15:03:45.596Z"
        },
        {
        "assigned_to": "",
        "status_text": "",
        "open": true,
        "_id": "601c0cd232fe6000dbfd99f7",
        "issue_title": "Faux Issue 1",
        "issue_text": "Get Issues Test",
        "created_by": "fCC",
        "created_on": "2021-02-04T15:03:46.067Z",
        "updated_on": "2021-02-04T15:03:46.067Z"
        },
        {
        "assigned_to": "",
        "status_text": "",
        "open": true,
        "_id": "601c0cd232fe6000dbfd99f8",
        "issue_title": "Faux Issue 2",
        "issue_text": "Get Issues Test",
        "created_by": "fCC",
        "created_on": "2021-02-04T15:03:46.311Z",
        "updated_on": "2021-02-04T15:03:46.311Z"
        },
        {
        "assigned_to": "",
        "status_text": "",
        "open": true,
        "_id": "601c0cd232fe6000dbfd99f9",
        "issue_title": "Faux Issue 3",
        "issue_text": "Get Issues Test",
        "created_by": "fCC",
        "created_on": "2021-02-04T15:03:46.540Z",
        "updated_on": "2021-02-04T15:03:46.540Z"
        },
        {
        "assigned_to": "",
        "status_text": "",
        "open": true,
        "_id": "601c0cd432fe6000dbfd99fe",
        "issue_title": "Issue to be Updated",
        "issue_text": "New Issue Text",
        "created_by": "fCC",
        "created_on": "2021-02-04T15:03:48.332Z",
        "updated_on": "2021-02-04T15:03:48.747Z"
        }
        ]
    chai.request(server)
        .get('/api/issues/ftests')
        .query(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result)
          assert.typeOf(res.body, 'array');
          done();
        });
  });

  test('6# View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    console.log("running test 6")
    let filter = {
      created_by: "fCC",
      issue_text: "Get Issues Test"
    }
    let result = [
                  {
                  "assigned_to": "",
                  "status_text": "",
                  "open": true,
                  "_id": "601c0cd232fe6000dbfd99f7",
                  "issue_title": "Faux Issue 1",
                  "issue_text": "Get Issues Test",
                  "created_by": "fCC",
                  "created_on": "2021-02-04T15:03:46.067Z",
                  "updated_on": "2021-02-04T15:03:46.067Z"
                  },
                  {
                  "assigned_to": "",
                  "status_text": "",
                  "open": true,
                  "_id": "601c0cd232fe6000dbfd99f8",
                  "issue_title": "Faux Issue 2",
                  "issue_text": "Get Issues Test",
                  "created_by": "fCC",
                  "created_on": "2021-02-04T15:03:46.311Z",
                  "updated_on": "2021-02-04T15:03:46.311Z"
                  },
                  {
                  "assigned_to": "",
                  "status_text": "",
                  "open": true,
                  "_id": "601c0cd232fe6000dbfd99f9",
                  "issue_title": "Faux Issue 3",
                  "issue_text": "Get Issues Test",
                  "created_by": "fCC",
                  "created_on": "2021-02-04T15:03:46.540Z",
                  "updated_on": "2021-02-04T15:03:46.540Z"
                  }
                ]
    chai.request(server)
        .get('/api/issues/ftests')
        .query(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result)
          assert.typeOf(res.body, 'array');
          done();
        });
  });

  test('7# Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    console.log("running test 7");
    let filter = {
      _id: '601c22832943aa0503e1a8ab',
      issue_text: 'test 1 issue, updated in test 7'
    };
    let result = {
                  "result": "successfully updated",
                  "_id": "601c22832943aa0503e1a8ab"
                };
    chai.request(server)
        .put('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });

  test('8# Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    console.log("running test 8");
    let filter = {
      _id: '601c22832943aa0503e1a8ab',
      issue_text: 'test 1 issue, updated in test 8',
      issue_title: 'Test 1 title, updated in test 8'
    };
    let result = {
                  "result": "successfully updated",
                  "_id": "601c22832943aa0503e1a8ab"
                };
    chai.request(server)
        .put('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });

  test('9# Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    console.log("running test 9");
    let filter = {
      issue_text: 'test 1 issue, updated in test 8',
      issue_title: 'Test 1 title, updated in test 8'
    };
    let result = { error: 'missing _id' };
    chai.request(server)
        .put('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });

  test('10# Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    console.log("running test 10");
    let filter = {
      _id: '601c22832943aa0503e1a8ab'
    };
    let result = { error: 'no update field(s) sent', '_id': '601c22832943aa0503e1a8ab' };
    chai.request(server)
        .put('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });

  test('11# Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    console.log("running test 11");
    let filter = {
      _id: 'invalidID',
      issue_text: 'issue updated in test 11'
    };
    let result = { error: 'could not update', '_id': 'invalidID' };
    chai.request(server)
        .put('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });

  test('12# Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    console.log("running test 12");

    let submit={
      issue_title: "To Be Deleted",
      issue_text: "dust",
      created_by: "nobody",
      open: true
    };
    
    chai.request(server)
        .post('/api/issues/ftests')
        .send(submit)
        .then((res)=>{
          console.log('inside idForRemoval-then')
          console.log(`res.body._id: ${res.body._id}`);
          id = res.body._id;
          deleteDoc(id);
        });

    const deleteDoc = async (id)=>{
      console.log(`inside deleteDoc`);
      let filter = {
        _id: id
      };
      let result = { result: 'successfully deleted', '_id': id };
      chai.request(server)
          .delete('/api/issues/ftests')
          .send(filter)
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, result);
            done();
          });
    }

  });

  test('13# Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    console.log("running test 13");
    let filter = {
      _id: '000000ce62fbf40618fb6b00'
    };
    let result = { error: 'could not delete', '_id': '000000ce62fbf40618fb6b00' };
    chai.request(server)
        .delete('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });

  test('14# Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    console.log("running test 14");
    let filter = {};
    let result = { error: 'missing _id' };
    chai.request(server)
        .delete('/api/issues/ftests')
        .send(filter)
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, result);
          done();
        });
  });
});
