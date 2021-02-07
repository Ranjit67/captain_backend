const mongoose=require("mongoose");

const schema= mongoose.Schema({
  email:{
    require:true,
    type:String
  },
  password:{
    require:true,
    type:String
  },
  name:{
    require:true,
    type:String
  },
  profile:{
    type:String
  }
});
module.exports = mongoose.model("User",schema);
