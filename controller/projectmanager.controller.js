//import sequelize
const sequelize=require("../DB/db.config")

//import express-async handler
const expressAsyncHandler=require("express-async-handler")

//import Op from sequelize
const { Op }=require('sequelize');

//configure dotenv
require("dotenv").config();

//import models
const { Employee }=require("../model/Employee.model");
const { User }= require("../model/user.model");
const { Concern }=require("../model/concern.model");
const { Update }=require("../model/update.model");
const { Project }=require("../model/project.model");
const { Team }=require("../model/project-team.model");
const { Resource }=require("../model/resource.model");
const { Client }=require('../model/client.model');

//create-associations
User.Project=User.hasMany(Project,{foreignKey:{name:"GDO"}});
User.Up=User.hasMany(Update,{foreignKey:{name:"updated_by"}});
Employee.Concern=Employee.hasMany(Concern,{foreignKey:{name:"raised_by"}});
Employee.Resource=Employee.hasMany(Resource,{foreignKey:{name:"raised_by"}});
Employee.Team=Employee.hasOne(Team,{foreignKey:{name:"email"}});
Project.Team=Project.hasOne(Team,{foreignKey:{name:"project_id"}});
Project.Resource=Project.hasMany(Resource,{foreignKey:{name:"raised_for_project"}});
Project.Concern=Project.hasMany(Concern,{foreignKey:{name:"project_id"}});
Project.Update=Project.hasMany(Update,{foreignKey:{name:"project_id"}});
Client.hasMany(Project,{foreignKey:{name:"client"}})

//new-update
const createUpdate=expressAsyncHandler(async(req,res)=>{
      
      let email=req.params.email
      let user = await User.findOne({
        where: { email: email},
      });
      let possibleToCreateProject=(user.role=="Project_Manager")?true:false;
      
      //only gdo can create the new-Update
      if(possibleToCreateProject){
        await Update.create(req.body)
      }
      else{
        res.send({message:"only Project Manager has access to create new update"})
      }
});


//update project-update by project manager

const updateProjectUpdateByManager=expressAsyncHandler(async(req,res)=>{
  let updateId=req.body.update_id;
  let projectId=req.params.project_id;
  let email=req.params.email;
  let user = await User.findOne({
    where: { email: email},
  });
  //only Project manager can update project-update
  if(user.role=="Project_Manager"){
    await Update.update({update_status:req.body.update_status},{where:{[Op.and]:[{update_id:updateId},{project_id:projectId}]}})
    res.send({message:"project-update updated"})
  }
  else{
    res.send({message:'You are not allowed to update project-update'})
  }
  
});

//delete project-update
const deleteProjectUpdate=expressAsyncHandler(async(req,res)=>{
  let updateId=req.params.update_id;
  let email=req.params.email;
  let user = await User.findOne({
    where: { email: email},
  });
  //only Project manager can delete project-update
  if(user.role=="Project_Manager"){
    await Update.destroy({where:{update_id:updateId}})
    res.send({message:"project-updated deleted"})
  }
  else{
    res.send({message:'You are not allowed to delete project-update'})
  }
  
});


//add client
const addClient=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await User.findOne({
    where: { email: email},
  });
  //project manager can add client
  if(user.role=="Project_Manager"){
    await Client.create(req.body)
  }
  else{
    res.send({message:"Only Project_Manager can create client"})
  }
});


//export
module.exports={ createUpdate, addClient, updateProjectUpdateByManager, deleteProjectUpdate }

