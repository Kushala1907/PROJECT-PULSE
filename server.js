//import express
const exp=require("express")
const app=exp()

//configure dotenv
require("dotenv").config()

//import sequelize
const sequelize=require('./DB/db.config')

//check for db connection
sequelize.authenticate()
.then(()=>console.log("DB connecion success"))
.catch(err=>console.log("Error in connecting to DB",err))

//body-parser
app.use(exp.json());

//callinc sync method on sequelize
sequelize.sync();


//create user route-path
const userApp=require("./route/user.route")
app.use("/user-api",userApp)

//create gdo route-path
const gdoApp=require("./route/gdo.route")
app.use("/gdo-api",gdoApp)

//create admin route-path
const adminApp=require("./route/admin.route")
app.use("/admin-api",adminApp)

//create superadmin route-path
const superadminApp=require("./route/superadmin.route")
app.use("/superadmin-api",superadminApp)

//create gdo route-path
const projectmanagerApp=require("./route/projectmanager.route")
app.use("/projectmanager-api",projectmanagerApp)

//invalid path
app.use('*',(req,res,next)=>{
    res.send({message:"Invalid Path"})
})

//default handler
app.use((err,req,res,next)=>{
   //console.log(err)
    res.send({errMsg:err.message})
})

module.exports=app;