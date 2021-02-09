'use strict';
const express = require('express');
const mongoose = require('mongoose');
const app = express();

module.exports = (app)=>{
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
  //let Issue = mongoose.model('Issue', issueSchema);
  async function connectAtStart(){
    let connectDB = await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log(`Connection to the Atlas Cluster db is successful!`)
        //let Issue = mongoose.model('Issue', issueSchema);
      })
      .catch((err) => console.error(err));
    mongoose.set('useFindAndModify', false);
  }

  const connect = async (project)=>{
    let currentDB = await mongoose.connection.useDb(project);
    console.log(`Db: ${project}`);
    return currentDB;
  }

  connectAtStart();

  app.route('/api/issues/:project')
  
    .get((req, res)=>{
      let project = req.params.project;
      
      async function showList(){
        console.log('inside showList');
        let filter = req.query;
        console.log(filter);
        
        // ## For GET with _id query
        if (req.query._id!=null) {
          try {
            filter._id = mongoose.Types.ObjectId(req.query._id);
          } catch (e) {
            console.log(`req.query._id error`)
            filter._id = mongoose.Types.ObjectId('000000000000000000000000');
          }
        }
        // ##

        let currentDB = await connect(project);
        let Issue = currentDB.model('Issue', issueSchema);
        
        let list = await Issue.aggregate([
          {
            $match: filter
          },
          {
            $project: {
              a: {$ifNull: ["$assigned_to", ""]},
              b: {$ifNull: ["$status_text", ""]},
              c: "$open",
              d: "$_id",
              e: "$issue_title",
              f: "$issue_text",
              g: "$created_by",
              h: "$created_on",
              i: "$updated_on"
            }
          },
          {
            $project: {
              assigned_to: "$a",
              status_text: "$b",
              open: "$c",
              _id: "$d",
              issue_title: "$e",
              issue_text: "$f",
              created_by: "$g",
              created_on: "$h",
              updated_on: "$i"
            }
          }
        ]);
        res.json(list);
      }
      
      showList();
    })
    
    .post((req, res)=>{
      let project = req.params.project;
      console.log(project);
      console.log(req.body);
      
      async function createDoc(){
        let timeNow = Date.now();
        let newIssue = {
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          open: true,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          created_on: timeNow,
          updated_on: timeNow
        }
        let currentDB = await connect(project);
        let Issue = currentDB.model('Issue', issueSchema);
        Issue.create(newIssue,(err,data)=>{
          //console.log(err.errors)
          if (err) {
            let valReqCount = 0;
            for (let errName in err.errors){
              console.log(`kind: ${err.errors[errName].kind}`)
              if (err.errors[errName].kind=='required'){
                valReqCount += 1;               
              } else {
                console.log(`{error: ${err.errors[errName].kind}}`);
              }
            }
            if (valReqCount>0) {
              res.json({error: 'required field(s) missing'});
            } else {
              res.json({error: err.errors[errName].kind});
            }
          } else {
            let display = {
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
            console.log('created new issue')
            res.json(display);
          }
        })
      }
      createDoc();
    })
    
    .put((req, res)=>{
      let project = req.params.project;
      console.log(req.body)
      async function updateDoc(){
        let update = {
          //open: true,
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
        let id = req.body._id;
        try {
          id = mongoose.Types.ObjectId(req.body._id);
        } catch (e) {
          console.log(`e: ${e}`);
          id = "000000000000000000000000"
          //throw new Error("error at obtaining ObjectId");
        }
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
          let currentDB = await connect(project);
          let Issue = currentDB.model('Issue', issueSchema);
          console.log(`id: ${id}`)
          update['updated_on'] = Date.now();
          Issue.findByIdAndUpdate(id, update, {new:true}, (err,data)=>{
            if (err || (data==null)) {
              console.log(err)
              res.json({
                error: 'could not update', 
                '_id': req.body._id
              })
            } else {
              console.log('successfully updated')
              console.log(`data: ${data}`)
              console.log(`{result: 'successfully updated', '_id': ${req.body._id}}`)
              res.json({result: 'successfully updated', '_id': req.body._id})
            }
          });
        }
      }
      updateDoc();
    })
    
    .delete((req, res)=>{
      let project = req.params.project;
      console.log(req.body)
      async function deleteDoc(){
        if (req.body._id==null) {
          console.log('missing _id')
          res.json({error: 'missing _id'})
        } else {
          let id = req.body._id;
          try {
            id = mongoose.Types.ObjectId(req.body._id);
          } catch (e) {
            console.log(`e: ${e}`);
            id = "000000000000000000000000"                    
          }
          let currentDB = await connect(project);
          let Issue = currentDB.model('Issue', issueSchema);
          Issue.deleteOne({_id:id}, (err, result)=>{
            if (err || result.deletedCount==0) {
              console.log(err)
              res.json({
                  error: 'could not delete', 
                  '_id': id
                })
            } else {
              console.log(`deletedCount: ${result.deletedCount}`)
              console.log(result)
              console.log(`successfully deleted, _id: ${id}`)
              res.json({result: 'successfully deleted', '_id': id})
            }
          })
        }
      }
      deleteDoc();
    });
};
