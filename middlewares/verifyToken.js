const jwt=require("jsonwebtoken")
const express=require("express")
//configure dotenv
require("dotenv").config()
const verifyToken=(req,res,next)=>{
    //get bearer token from header token of req
    let bearerToken=req.headers.authorization;
    //check presence of bearer token
    if(bearerToken==undefined){
        res.status(401).send({message:"Unauthorized access"})
    }
    //if bearer token exist ,get token from bearer token
    else{
        let token=bearerToken.split(" ")[1];
        try{
            let decoded=jwt.verify(token, process.env.SECRET_KEY);
            next()
        }
        catch{
            res.send({message:"Plz re-login to continue..."})
        }
    }
    //decode the token
    
};
module.exports=verifyToken;