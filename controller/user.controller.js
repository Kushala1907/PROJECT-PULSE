//import sequelize
const sequelize=require("../DB/db.config")

//import express-async handler
const expressAsyncHandler=require("express-async-handler")

//import nodemailer
const nodemailer=require("nodemailer");

//import Op from sequelize
const { Op }=require('sequelize');

//import bcryptjs
const bcryptjs=require("bcryptjs");

//import jwt token
const jwt=require("jsonwebtoken");

//import crypto
const crypto=require("crypto");

//configure dotenv
require("dotenv").config();

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD // app password
  }
})

//Creating otps object
let otps={}

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



//register-user
const registerUser=expressAsyncHandler(async(req,res)=>{
    let email=req.body.email;
    email = email.toLowerCase();
    //check for westagilelabs email if email not belongs to westagilelabs
    if (!/^([A-Za-z0-9_\.])+\@(westagilelabs)+\.(com)$/.test(email)) {
      res.status(401).send({
        message: "Only Organization Emails required ,Others Not Allowed",
      });
    }
    //if email belongs to westagilelabs
    else{
      let user=await Employee.create(req.body)
      res.status(201).send({message:"Registration successfull...",payload:user})
    }
    
});

//login-for-users
const loginUser=expressAsyncHandler(async(req,res)=>{
  
    //unpacking req.body
    let { email, password } = req.body;
    //check for user with email
    let user = await User.findOne({
      where: { email: req.body.email},
    });
    
    //if username not exists
    if (user==undefined) {
        res.status(203).send({ message: "User Not Found" });   
    }
    //if user exist
    else{
      //compare passwords
      let passwordMatches=(password==user.password)?true:false;
      //let pwd = await bcryptjs.compare(password, user.password);
      //if passwordMatches is true
      if (passwordMatches) {
        //generate jwt token by using jwt
        let signedToken = jwt.sign({email:email}, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        if(user.role=="GDO"){
          res.status(202).send({message:`success`,token: signedToken,payload:user})
        }
        if(user.role=="Admin_Users"){
          res.status(202).send({message:`success`
                            ,token: signedToken,payload:user})
        }
        else{
          res.status(202).send({message:'success',token: signedToken,payload:user})
        }
      }
      //If password is incorrect/not matching
      else {
        res.status(401).send({ message: `Incorrect Password` });
      }
    }
});


//forgot password
const forgotPassword=expressAsyncHandler(async(req,res)=>{
  //generating 6 digit random number as otp to reset password
  let otp=Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  //add OTP to otps object
  otps[req.body.email]=otp
  //draft email
  let mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'OTP to reset password',
      text: `Hello ,
       We received a request to reset your password .Enter the following OTP to reset your password :
        `+otp
    }
    console.log(otp)
  //send email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  //setting valid time to OTP(10 minutes)
  setTimeout(()=>{
      //delete OTP from object after 10 minutes
      delete otps[req.body.email]
  },6000000)
  res.status(200).send({message:"OTP to reset your password is sent to your email",payload:req.body.email})
  
});

//reset password
const resetPassword=expressAsyncHandler(async(req,res)=>{
  //otp matches
  if(req.body.otp==otps[req.params.email]){
      console.log("password verififed");
      //let hashedPassword=await bcryptjs.hash(req.body.password,6)
      await User.update({password:req.body.password},{where:{
          email:req.params.email
      }})
      res.status(200).send({message:"Password reset sucessfully"})
  }
  else{
      res.send({message:"Invalid OTP"})
  }
});

//raise-concern by employee
const raiseConcern=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  
  //only gdo can create the new-Project
  if(user){
    await Concern.create(req.body)
  }
  else{
    res.status(401).send({message:"only WAL Employee has access to raise concern"})
  }
});

//raised concern and trigger a email to admin
const raiseConcernTriggerEmail = expressAsyncHandler(async (req, res) => {
  let mailOptions = {
    from: "naredlakushala@gmail.com",
    to: "dayyubiddika095@gmail.com",
    subject: `Project concern is raised for project ${req.body.project_id} by ${req.body.raised_by}`,
    text: `Hello Admin,
     A project concern is raised for the above project and the concern description is: ${req.body.concern_desc}
     severity of project concern:${req.body.concern_severity} `,
  };
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(201).send({ message: "Project concern is raised" });
});


//team-composition
const addTeam=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  //only wal employee can add team-composition
  if(user){
    await Team.create(req.body)
  }
  else{
    res.status(401).send({message:"Only WAL Employee can be added to team"})
  }
});



//team-composition
const getTeamComposition=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let teamId=req.params.team_id
  let user = await User.findOne({
    where: { email: email},
  });
  if(user){
    let team=await Team.findAll({attributes:{exclude:['team_id','project_id']}},{where:{[Op.and]:[{email:user.email},{team_id:teamId}]}});
    res.send({team})
  }
  else{
    res.send({message:"You are not allowed to access"})
  } 
  
});

//assign project to employee
const assignProject=expressAsyncHandler(async(req,res)=>{
  //get email from url
  let email=req.params.email
  //find user with email
  let user = await Employee.findOne({
    where: { email: email},
  });
  //if user found assign project
  if(user){
    await Team.create(req.body)
  }
  else{
    res.status(401).send({message:"only WAL Employee can be assigned with project"})
  }
  
});

//get all concerns
const getAllConcerns=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  
  if(user.role=="Project_Manager" || user.role=="GDO"  || user.role=="Admin_Users"){
    let concerns=await Concern.findAll();
    res.status(201).send({payload:concerns})
    
  }
  else{
    res.status(401).send({message:"You don't have access"})
  }
  
});

//get all-updates
const getAllUpdates=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  
  if(user.role=="Project_Manager" || user.role=="Admin_Users"){
    let updates=await Update.findAll();
    res.status(201).send({payload:updates})
    
  }
  else{
    res.status(401).send({message:"You don't have access"})
  }
  
});

//get team-compostion
const getAllTeams=expressAsyncHandler(async(req,res)=>{
      
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  
  if(user){
    let teams=await Team.findAll();
    res.status(200).send({payload:teams})
    
  }
  else{
    res.status(401).send({message:"You don't have access"})
  }
  
});


//export
module.exports={
      registerUser,loginUser, forgotPassword,
      resetPassword,raiseConcern,
      addTeam, getTeamComposition, 
      assignProject, getAllConcerns, getAllUpdates,
      getAllTeams, raiseConcernTriggerEmail
}
    
