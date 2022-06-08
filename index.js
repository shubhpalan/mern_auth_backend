const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


var jsonParser = bodyParser.json()
app.use(jsonParser);
app.use(cookieParser());

app.use(cors({credentials:true,origin:"http://localhost:3000"}));

app.use("/user",require("./routes/user"));

// test server
app.get("/ping",(req,res)=>{
    res.send("pong");
})

mongoose.connect("mongodb+srv://dbadmin:helloworld@cluster0.7toeybc.mongodb.net/db1").then(()=>{
    console.log("Database Connected")
    
    app.listen(3010,()=>{
        console.log("server is running")
    })
})