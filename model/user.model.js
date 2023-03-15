const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.User=sequelize.define('user',
    {
        //atrributes
        email:{
            type:DataTypes.STRING,
            primaryKey:true,
            //autoIncrement:true
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
)