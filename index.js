//import app from server
const app=require('./server')

//assign port
app.listen(3030,()=>console.log("htttp server running on ${PORT}..."))