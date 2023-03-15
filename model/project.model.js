const sequelize=require("../DB/db.config")
const {DataTypes}=require("sequelize")

//create and export model

exports.Project=sequelize.define('project',
    {
        //atrributes
        project_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        project_name:{
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
        domain:{
            type:DataTypes.STRING
        },
        team_size:{
            type:DataTypes.INTEGER
        },
        project_type:{
            type:DataTypes.STRING
        },
        fitness_indicator:{
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