const express = require("express");
const bcrypt = require('bcrypt');
const user= require("../module/user");
require('dotenv').config()
const jwt = require("jsonwebtoken");

const router=express.Router();

const saltRounds=10;
router.post("/login",(req,res)=>{
  res.status(200).json({massege:"That is log in phase."});
})


router.post("/signup",(req,res)=>{
  const {email,password,name}=req.body;
  if(!password || !name || !email ){
    res.status(422).json({error:"you have to input all the field."});
  } else {
    user.find({email:email})
    .then(data=>{
      // console.log(data[0]);
      if(!data[0]){
        bcrypt.hash(password, saltRounds)
        .then(has=>{
          const User= new user({
            name:name,
            email:email,
            password:has
          })
          User.save()
          .then(s=>{
            const token = jwt.sign({_id:s._id},process.env.JWT_SECURE);
            res.status(200).json({massage:"Your data is save succesfuly.",token})
          })
          .catch(err=>console.log(err))

        })
        .catch(err=>console.log(err))


      }else{


        res.status(422).json({error:"This email id is alredy register."});

      }
    })
    .catch(err=>console.log(err));

  }
})

// router.post("/s", ( req, res )=>{
//   const {email,password,name}=req.body;
//   res.send({data:req.body});
// })















router.post("/signin",(req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    res.status(422).json({error:"Please file the all the field."});
  } else{
    user.findOne({email:email})
    .then(data=>{
      if(!data){
        res.status(422).json({error:"Your email and password is incorrect."});
      } else{
        bcrypt.compare(password, data.password)
        .then(domatch=>{
          if(!domatch){
            res.status(422).json({error:"Please correct your email and password."})
          } else{

          const token = jwt.sign({_id:data._id},process.env.JWT_SECURE);
          const {_id,name,email}=data;
            res.status(200).json({token,user:{_id,name,email}})
          }
        })
        .catch(err=>console.log(err))
      }
    })
    .catch(err=>console.log(err))
  }
})


module.exports=router;
