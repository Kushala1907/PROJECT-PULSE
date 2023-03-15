const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.Update=sequelize.define('update',
    {
        //atrributes
        update_id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        update_date:{
            type:DataTypes.DATE
        },
        update_status:{
            type:DataTypes.STRING
        },
        schedule_status:{
            type:DataTypes.STRING
        },
        resource_status:{
            type:DataTypes.STRING
        },
        quality_status:{
            type:DataTypes.STRING
        },
        waiting_for_clientInput:{
            type:DataTypes.BOOLEAN
        }
    },
    {
        timestamps:false,
        createdAt:false,
        updatedAt:false,
        freezeTableName:false
    }
)