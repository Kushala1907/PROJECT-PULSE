//import sequelize
const sequelize=require("../DB/db.config")

//import express-async handler
const expressAsyncHandler=require("express-async-handler")

//configure dotenv
require("dotenv").config();

//import models
const { Employee }=require("../model/Employee.model");
const { User }= require("../model/user.model");

//super-admin assign role to employee
const assignRole=expressAsyncHandler(async(req,res)=>{
  let email=req.params.email
  let user = await Employee.findOne({
    where: { email: email},
  });
  //only super_admin can assign role
  if(user.role=="Super_Admin"){
    //if employee belongs to god,project_manager,hr_manager,super_admin,admin_users add him/her to User
    if(req.body.role=="GDO" || req.body.role=="Project_Manager" || req.body.role=="HR_Manager" || req.body.role=="Super_Admin" || req.body.role=="Admin_Users"){
        await User.create(req.body)
    }
    //else add to Employee
    await Employee.update(req.body,{where:{email:req.body.email}})
    res.status(201).send({message:"Role Assigned by Super Admin..."})
  }
  //if user is other than super_admin
  else{
    res.status(401).send({message:"You are not allowed to assign role to employee only SUPER_ADMIN has access..."})
  }
  
});

//get all-employees
const getAllEmployees=expressAsyncHandler(async(req,res)=>{
   
      let employees=await Employee.findAll();
      res.status(200).send({employees})
  
});

//get all users
const getAllUsers=expressAsyncHandler(async(req,res)=>{
   
  let users=await User.findAll();
  res.status(200).send({users})

});

//export
module.exports={ assignRole, getAllEmployees, getAllUsers }

