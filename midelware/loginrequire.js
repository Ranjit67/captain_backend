const jwt= require("jsonwebtoken");
const {JWT_SECURE} = require("../data");
const user =require("../module/user");

module.exports=(req,res,next)=>{
  const {authorization}=req.headers;
  if(!authorization){
    res.status(401).json({error:"You need to login feast."})
  }else{
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,JWT_SECURE,(err,paylod)=>{
      if(err){
          res.status(401).json({error:"You need to login feast."});
      } else{
        const {_id}=paylod;
        user.findById(_id)
        .then(userdetail=>{
          req.user=userdetail;
          next();
        })
        .catch(err=>console.log(err));
      }
    })
  }

}
