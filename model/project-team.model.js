const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.Team=sequelize.define('team',
    {
        //atrributes
        team_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            //autoIncrement:true
        },
        resource_name:{
            type:DataTypes.STRING
        },
        role_in_project:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.STRING
        },
        start_date:{
            type:DataTypes.DATE
        },
        end_date:{
            type:DataTypes.DATE
        },
        billing_status:{
            type:DataTypes.STRING
        },
        exposedToClient:{
            type:DataTypes.BOOLEAN
        },
        allocation_type:{
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