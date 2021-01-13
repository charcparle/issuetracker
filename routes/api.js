'use strict';
const express = require('express');

const app = express();

module.exports = (app, mongoose)=>{
  console.log("apiRoutes is imported")
  const Schema = mongoose.Schema;
  const issueSchema = new Schema({
    //{"assigned_to":"","status_text":"","open":true,"_id":"5ffeb8d7487ac531385e58f9","issue_title":"1","issue_text":"2","created_by":"3","created_on":"2021-01-13T09:09:43.027Z","updated_on":"2021-01-13T09:09:43.027Z"}
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
      ///*
      Issue.create(newIssue,(err,data)=>{if (err) console.log(err)})
      //*/
    })
    
    .put((req, res)=>{
      let project = req.params.project;
      
    })
    
    .delete((req, res)=>{
      let project = req.params.project;
      
    });
};
