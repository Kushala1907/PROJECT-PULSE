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
      let possibleToCreateProject=(user.role=="GDO")?true:false;
      
      //only gdo can create the new-Project
      if(possibleToCreateProject){
        await Project.create(req.body)
      }
      //other than gdo
      else{
        res.send({message:"only GDO has access to create new project"})
      }
});

//get project dashboard
const projectDashboard=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await User.findOne({
    where: { email: email},
  });
  console.log(user.role);
  //if user is admin user he/she can access all projects
  if(user.role=="Admin_Users"){
      let projects=await Project.findAll({attributes:{exclude:['project_id','domain','team_size','project_type','GDO']}});
      res.status(200).send({payload:projects,user:user})
  }
  //gdo can access projects under him/her
  else{
    let projects=await Project.findAll({where:{GDO:req.params.email}},{attributes:{exclude:['project_id','domain','team_size','project_type','GDO']}});
    res.status(200).send({payload:projects,user:user})
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
  if(user.role=="GDO"){
    let projectRecord = await Project.findOne({
      where: {
        project_id: projectId,
        GDO: req.params.email,
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
    let [teamSize]=await sequelize.query("select count(team_id) as teamsize from team where billing_status=? and project_id=?",{replacements:["billed",projectId]})
    res.status(201).send({payload:projectRecord,teamsize:teamSize})
  }
  else{
    res.status(401).send({message:"You are not allowed to access"})
  }
  
});


//raise-resource
const raiseResource=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  //only wal employee raise resource
  if(user.role=="GDO"){
    let resource=await Resource.create(req.body)
    res.status(201).send({payload:resource,message:"Rasied resource successfully"})
  }
  else{
    res.status(401).send({message:"only GDO can raise resource"})
  }
});

//get last two weeks updates
const lastTwoWeekUpdates=expressAsyncHandler(async(req,res)=>{
      
  let projectId=req.params.project_id
  let projects=await Project.findAll({where:{[Op.and]:[{GDO:req.params.email},{project_id:projectId}]}})
  if(projects.length!=0){
    let updates=await Update.findAll({
      where:{
        project_id: projectId,
        update_date: { [Op.gt]: new Date(Date.now() - 1209600000) },
      },
      order : [["update_date", "DESC"]],
    });
    if(updates.length!=0){
      res.send({ message: "All last two weeks updates", payload: updates });
    }
    else{
      res.send({ message: "No updates in last two weeks"})
    }
  }
  else{
    res.send({ message: "No projects under given gdo"})
  }
  
});

//export
module.exports={ createProject, projectDashboard, raiseResource, projectDetails, lastTwoWeekUpdates }

