//import express module
const exp=require("express")

//create projectManagerApp express mini application
const gdoApp=exp.Router();

//import middleware
const verifyToken=require("../middlewares/verifyToken")

const { createProject,projectDashboard, projectDetails,raiseResource,lastTwoWeekUpdates}=require("../controller/gdo.controller")

//body-parser
gdoApp.use(exp.json())

gdoApp.post('/create-project/:email',verifyToken,createProject);
gdoApp.get('/project-dashboard/:email',verifyToken,projectDashboard);
gdoApp.post('/raise-resource/:email',verifyToken,raiseResource);
gdoApp.get('/project_details/project_id/:project_id/:email',verifyToken,projectDetails);
gdoApp.get('/project-updates/gdo/:email/:project_id',verifyToken,lastTwoWeekUpdates);

module.exports=gdoApp