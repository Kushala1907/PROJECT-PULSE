const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.Concern=sequelize.define('concern',
    {
        //atrributes
        concern_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        concern_desc:{
            type:DataTypes.STRING
        },
        concern_severity:{
            type:DataTypes.STRING
        },
        raised_on:{
            type:DataTypes.DATE
        },
        raised_from:{
            type:DataTypes.STRING
        },
        concern_status:{
            type:DataTypes.STRING
        },
        mitigated_date:{
            type:DataTypes.DATE
        }
    },
    {
        timestamps:false,
        createdAt:false,
        updatedAt:false,
        freezeTableName:true
    }
)