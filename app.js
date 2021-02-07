const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require('dotenv').config()
const app = express();



app.use(morgan("dev"))
app.use( function (req, res, next) {


  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  
  if(req.method === 'OPTIONS'){
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({})
  }
  // Pass to next layer of middleware
  next();
});


// database connection
// mongo "mongodb+srv://cluster0.y5crp.mongodb.net/<dbname>" --username <username>
mongoose.connect(process.env.MONGODATA,
{ useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("connected",()=>{
  console.log("Database is succesfuly connected.");
})
mongoose.connection.on("error",()=>{
  console.log("connection fail.");
})




app.get("/",(req,res)=>{
  res.send("We got it.")
})
app.use(express.json());
// app.use(require("./router/login.js"));
app.use(require("./router/entery.js"));
app.use(require("./router/authorization/auth"));
app.use(require("./router/songlist"));

app.listen(process.env.PORT || 5000,()=>{
  console.log("The port 5000 is redy to satrt..");
})
