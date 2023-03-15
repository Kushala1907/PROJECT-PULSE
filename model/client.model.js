const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.Client=sequelize.define('client',
    {
        //atrributes
        client:{
            type:DataTypes.STRING,
            primaryKey:true
        },
        clientAccountManager:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    },
    {
        timestamps:false,
        createdAt:false,
        updatedAt:false,
        freezeTableName:true
    }
)