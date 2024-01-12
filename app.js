const express=require("express");
const cors=require("cors");

const userRouter=require("./Api/Routers/userRouter")

//MIDDLEWARE
const app= express();
app.use(express.json({limit: "100kb"}));

// app.use(cors());
// app.options("*",cors());

app.use(cors(
    {
      origin: ["https://crypto-bot.vercel.app"],
      methods: ["POST","GET","PUT","DELETE"],
      credentials: true
    }
  ));

//ROUTERS
app.use("/api/v1/user",userRouter);

module.exports=app;