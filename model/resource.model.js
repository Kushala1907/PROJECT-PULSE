const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.Resource=sequelize.define('resource',
    {
        //atrributes
        resource_id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        
        resource_desc:{
            type:DataTypes.STRING
        }
    },
    {
        timestamps:false,
        createdAt:false,
        updatedAt:false,
        freezeTableName:true
    }
)