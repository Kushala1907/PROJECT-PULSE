//import express module
const exp=require("express")
//create projectManagerApp express mini application
const userApp=exp.Router();
//import middleware
const verifyToken=require("../middlewares/verifyToken")

const {registerUser, loginUser, forgotPassword, resetPassword,
    raiseConcern,addTeam,getTeamComposition, assignProject,
    getAllConcerns, getAllUpdates, getAllTeams, raiseConcernTriggerEmail}=require("../controller/user.controller")

//body-parser
userApp.use(exp.json())

//Routes
userApp.post('/register-user',registerUser);
userApp.post('/login',loginUser);
userApp.post('/forgot-password',forgotPassword);
userApp.post('/reset-password/email/:email',resetPassword);
userApp.post('/raise-concern/:email',verifyToken,raiseConcern);
userApp.post('/raise-concern-trigger-mail/:email',verifyToken,raiseConcernTriggerEmail);
userApp.post('/team-composition/:email',verifyToken,addTeam);
userApp.post('/assign-project/:email',verifyToken,assignProject);
userApp.get('/team-composition/team_id/:team_id/:email',verifyToken,getTeamComposition);
userApp.get('/all-concerns/:email',verifyToken,getAllConcerns);
userApp.get('/all-updates/:email',verifyToken,getAllUpdates);
userApp.get('/all-teams/:email',verifyToken,getAllTeams);

//export
module.exports=userApp