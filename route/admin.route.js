//import express module
const exp=require("express")
//create projectManagerApp express mini application
const adminApp=exp.Router();
//import middleware
const verifyToken=require("../middlewares/verifyToken");

const {createProject,deleteProject,updateProjectByAdmin,projectDashboard,projectDetails,projectUpdates}=require("../controller/admin.controller")



//body-parser
adminApp.use(exp.json())

adminApp.post('/create-project/:email',verifyToken,createProject);
adminApp.delete('/delete-project/admin-user/:email/project-id/:project_id',verifyToken,deleteProject);
adminApp.put('/update-project/admin-user/:email/project-id/:project_id',verifyToken,updateProjectByAdmin);
adminApp.get('/project-dashboard/:email',verifyToken,projectDashboard);
adminApp.get('/project_details/project_id/:project_id/:email',verifyToken,projectDetails);
adminApp.get('/project_updates/project_id/:project_id/:email',verifyToken,projectUpdates);


module.exports=adminApp