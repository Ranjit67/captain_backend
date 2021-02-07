const mongoose=require("mongoose");

const schema = mongoose.Schema({
    mood :{
        require:true,
        type:String
      },
    language :{
        require:true,
        type:String
      },
    songtype :{
        require:true,
        type:String
      }, 
    album :{
        require:true,
        type:String
      }, 
    song :{
        require:true,
        type:String
      }, 
    poster :{
        require:true,
        type:String
      }, 
    songname :{
        require:true,
        type:String
      },
      like:[
        {userid:{
          type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
        }
      }
      ]
});

module.exports = mongoose.model("Song",schema)