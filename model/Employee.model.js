const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize");
const { Employee } = require("d:/orm/modules/emp.model");

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
//create and export model

exports.Employee=sequelize.define('employee',
    {
        //atrributes
        email:{
            type:DataTypes.STRING,
            primaryKey:true
        },
        employee_name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        role:{
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:null
        }
    },
    {
        timestamps:false,
        createdAt:false,
        updatedAt:false,
        freezeTableName:true
    }
);
