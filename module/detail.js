const mongoose=require("mongoose");
const user = require("./user");


const schema= mongoose.Schema({
owner:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
},
  language:{
    type:String,
    require:true
  },
  mood:{
    type:String,
    require:true
  },
  songType: {
    type:String,
    require:true
  }
});
module.exports = mongoose.model("Detail", schema);