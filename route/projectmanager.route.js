//import express module
const exp=require("express")
//create projectManagerApp express mini application
const projectmanagerApp=exp.Router();
//import middleware
const verifyToken=require("../middlewares/verifyToken")

const {createUpdate, addClient,
    updateProjectUpdateByManager, deleteProjectUpdate}=require("../controller/projectmanager.controller");


//body-parser
projectmanagerApp.use(exp.json())

projectmanagerApp.post('/create-update/:email',verifyToken,createUpdate);
projectmanagerApp.put('/update-updates/project-manager/:email/project-id/:project_id',verifyToken,updateProjectUpdateByManager);
projectmanagerApp.delete('/detete-project-update/project-manager/:email/update-id/:update_id',verifyToken,deleteProjectUpdate);
projectmanagerApp.post('/add-client/:email',verifyToken,addClient);

module.exports=projectmanagerApp