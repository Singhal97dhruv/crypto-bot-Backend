const mongoose=require("mongoose");
const dotenv=require("dotenv");

const dev=process.env.NODE_ENV!="production";

dotenv.config({path: "./config.env"});
const app=require("./app");

//DATABASE
const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,

}).then(()=>console.log("DB connected Successfully"));

const PORT= process.env.PORT||3000;

 
    app.listen(PORT,()=>{
        console.log(`App Running on port ${PORT}...`)
    })