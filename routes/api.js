'use strict';
const express = require('express');

const app = express();

module.exports = (app, mongoose)=>{
  console.log("apiRoutes is imported")
  const Schema = mongoose.Schema;
  const issueSchema = new Schema({
    assigned_to: {type: String},
    status_text: {type: String},
    open: {type: Boolean, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true}
  })
  let Issue = mongoose.model('Issue', issueSchema);
  console.log(Issue);
  app.route('/api/issues/:project')
  
    .get((req, res)=>{
      let project = req.params.project;
      console.log(req.body);
      async function showList(){
        let list = await Issue.aggregate([
          {
            $project: {
              assigned_to: 1,
              status_text: 1,
              open: 1,
              "_id": 1,
              issue_title: 1,
              issue_text: 1,
              created_by: 1,
              created_on: 1,
              updated_on: 1
            }
          }
        ]);
        res.send(list);
      }
      showList(res).then(console.log("showList loaded"));
    })
    
    .post((req, res)=>{
      let project = req.params.project;
      console.log(project)
      console.log(req.body);
      let timeNow = Date.now();
      let newIssue = {
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        open: true,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: timeNow,
        updated_on: timeNow
      }
      Issue.create(newIssue,(err,data)=>{
        if (err) console.log(err);
        /*
        let rtnObj = {
          assigned_to: data.assigned_to,
          status_text: data.status_text,
          open: data.open,
          _id: data._id,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_by: data.created_by,
          created_on: data.created_on,
          updated_on: data.updated_on
        }
        */
        async function showList(){
          //use aggregate to show the new items, passed in as data
          res.json(list);
        }
        showList(res).then(console.log("showList loaded"));
      })
    })
    
    .put((req, res)=>{
      let project = req.params.project;
      console.log(req.body)
      let update = {
        open: true,
        updated_on: Date.now()
      };
      let nilUpdate = true;
      if (req.body.assigned_to!="" && req.body.assigned_to!=null) {
        update["assigned_to"] = req.body.assigned_to;
        nilUpdate = false;
      }
      if (req.body.status_text!="" && req.body.status_text!=null) {
        update["status_text"] = req.body.status_text;
        nilUpdate = false;
      }
      if (req.body.issue_title!="" && req.body.issue_title!=null) {
        update["issue_title"] = req.body.issue_title;
        nilUpdate = false;
      }
      if (req.body.issue_text!="" && req.body.issue_text!=null) {
        update["issue_text"] = req.body.issue_text;
        nilUpdate = false;
      }
      if (req.body.open!=null) {
        update["open"] = false;
        console.log(`open: ${update["open"]}`)
        nilUpdate = false;
      }
      let id = mongoose.Types.ObjectId(req.body._id);
      if (req.body._id==null){
        console.log('missing _id')
        res.json({error: 'missing _id'});
      } else if (nilUpdate) {
        let rtnObj = {
          error: 'no update field(s) sent', 
          '_id': req.body._id
        }
        console.log(rtnObj)
        res.json(rtnObj);
      } else {
        //let id = mongoose.Types.ObjectId(req.body._id);
        Issue.findByIdAndUpdate(id, update, (err,data)=>{
          if (err) {
            console.log(error)
            res.json({
              error: 'could not update', 
              '_id': req.body._id
            })
          }
        });
        console.log('successfully updated')
        res.json({result: 'successfully updated', '_id': req.body._id})
      }
    })
    
    .delete((req, res)=>{
      let project = req.params.project;
      
    });
};
