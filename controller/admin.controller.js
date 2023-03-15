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
Employee.Res=Employee.hasMany(Resource,{foreignKey:{name:"raised_by"}});
Employee.Team=Employee.hasOne(Team,{foreignKey:{name:"email"}});
Project.Team=Project.hasOne(Team,{foreignKey:{name:"project_id"}});
Project.Res=Project.hasMany(Resource,{foreignKey:{name:"raised_for_project"}});
Project.Concern=Project.hasMany(Concern,{foreignKey:{name:"project_id"}});
Project.Up=Project.hasMany(Update,{foreignKey:{name:"project_id"}});
Client.hasMany(Project,{foreignKey:{name:"client"}})


//create project
const createProject=expressAsyncHandler(async(req,res)=>{
  //get email from url
  let email=req.params.email
  //find user with email
  let user = await User.findOne({
    where: { email: email},
  });
  //if user is gdo then it is possible to create project
  let possibleToCreateProject=(user.role=="Admin_Users")?true:false;
  
  //only gdo can create the new-Project
  if(possibleToCreateProject){
    await Project.create(req.body)
  }
  //other than gdo
  else{
    res.send({message:"only Admin user has access to create new project"})
  }
});

//delete-project by admin users

const deleteProject=expressAsyncHandler(async(req,res)=>{
  let {projectId}=req.params.project_id;
  let email=req.params.email;
  let user = await User.findOne({
    where: { email: email},
  });
  //only admin can delete project
  if(user.role=="Admin_Users"){
    await Project.destroy({where:{project_id:projectId}})
    res.status(200).send({message:"project deleted"})
  }
  else{
    res.status(401).send({message:'You are not allowed to delete project'})
  }
  
});


//update project by admin users

const updateProjectByAdmin=expressAsyncHandler(async(req,res)=>{
  let projectId=req.params.project_id;
  let email=req.params.email;
  let user = await User.findOne({
    where: { email: email},
  });
  //only admin can update project
  if(user.role=="Admin_Users"){
    await Project.update({project_name:req.body.project_name},{where:{project_id:projectId}})
    res.status(200).send({message:"project updated"})
    
  }
  else{
    res.status(401).send({message:'You are not allowed to update project'})
  }
  
});

//get project dashboard
const projectDashboard=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await User.findOne({
    where: { email: email},
  });
  //if user is admin user he/she can access all projects
  if(user.role=="Admin_Users"){
      let projects=await Project.findAll({attributes:{exclude:['project_id','domain','team_size','project_type','GDO']}});
      res.status(200).send({projects})
  }
  //gdo can access projects under him/her
  else{
    let projects=await Project.findAll({attributes:{exclude:['project_id','domain','team_size','project_type','GDO']}},{where:{GDO:user.email}});
    res.status(200).send({projects})
  }
});

//project-Details
const projectDetails=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let projectId=req.params.project_id
  let user = await User.findOne({
    where: { email: email},
  });
  //if user(gdo) exist return project-details of project with project_id=projectId
  if(user.role=="Admin_Users"){
    let projectRecord = await Project.findOne({
      where: {
        project_id: projectId,
      },
  
      include: [
        {
          association: Project.Up,
        },
  
        {
          association: Project.Concern,
        },
        {
          association: Project.Team,
        },
      ],
    });
    res.status(200).send({projectRecord})
  }
  else{
    res.status(401).send({message:"You are not allowed to access"})
  }
  
});

//project updates
const projectUpdates=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let projectId=req.params.project_id
  let user = await User.findOne({
    where: { email: email},
  });
  if(user.role=="Admin_Users"){
    let updates=await Update.findAll({where:{project_id:projectId}});
    res.send({updates})
  }
  else{
    res.send({message:"You are not allowed to access"})
  }
});


//export
module.exports={ createProject,deleteProject,updateProjectByAdmin,projectDashboard,projectDetails,projectUpdates }
