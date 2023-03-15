require("dotenv").config()

//import sequelize
const {Sequelize}=require("sequelize")

//create instance

const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,
    {
        host:"localhost",
        dialect:'mysql'
    }
    );

//export
module.exports=sequelize