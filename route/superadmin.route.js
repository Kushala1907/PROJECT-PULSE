//import express module
const exp=require("express")
//create projectManagerApp express mini application
const superadminApp=exp.Router();
//import middleware
const verifyToken=require("../middlewares/verifyToken")

const {assignRole, getAllEmployees, getAllUsers}=require("../controller/superadmin.controller")

//body-parser
superadminApp.use(exp.json())

superadminApp.put('/assign-role/:email',verifyToken,assignRole);
superadminApp.get('/getAll-employees/:email',verifyToken,getAllEmployees);
superadminApp.get('/getAll-employees/:email',verifyToken,getAllUsers);

module.exports=superadminApp