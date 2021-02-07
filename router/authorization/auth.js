const express = require("express");
const bcrypt = require('bcrypt');
const loginrequire = require("../../midelware/loginrequire");
const songer = require("../../module/song");
const user= require("../../module/user");
const detail = require("../../module/detail");
const historye = require("../../module/history");

const router=express.Router();

const saltRounds=10;

// insert intereset
router.post("/interest", loginrequire, ( req, res )=>{
  const { mood, language, songType } = req.body;
if(!mood || !language || !songType){
  res.status(400).json({error:"You can't any singel place."})
}else{
  detail.find({owner:req.user.id})
  .then(f=>{
    if(f[0]){
      res.status(400).json({message:"It need to update"})
    } else {

      const Detail = new detail({
        owner:req.user.id,
        language:language,
        mood:mood,
        songType:songType
      })
      Detail.save()
      .then((s)=>{
        res.status(200).json({message:"The data is save for type."})
      })
      .catch(err=>console.log(err))
    }
  })

  .catch(err=>console.log(err))


}

})

// delete interest
router.delete("/interest-delete", loginrequire, ( req, res )=>{
  detail.deleteOne({owner:req.user.id})
  .then(data=>{
    // console.log(data)
    if(!data){
      res.status(422).json({error:"Somthing is wrong."})
    } else{
      res.status(200).json({message:"Data deleted successfully."})
    }
  })
  .catch(err=>console.log(err))
})


router.post("/interstgetsong", loginrequire, ( req, res )=>{
  let l;
  detail.find({owner:req.user.id})
  .then((data)=>{
    if(!data[0]){
      res.status(400).json({error:"Data is not found."})
    }else{
      
      const lan=data[0].language
      const sty = data[0].songType
      const mod = data[0].mood
     
      songer.find({language:lan, mood:mod, songtype:sty})
      .then(s=>{
          l=s;
          songer.find({ language:lan })
          .then(d=>{
            if(!d[0]){
              res.status(201).json({error:"Language type not found."})
            } else {
              l=[l,...d]
              
              res.status(200).json({data:l})
            }
          })
        // }
      })
      .catch(err=>console.log(err))
    }
  })
})

// get song details by id
router.post("/playlister/api/:id", loginrequire, ( req, res )=>{
  const { id } = req.params;
  songer.find({_id:id})
  .then(data=>{
    if(!data[0]){
      res.status(422).json({error:"Data is not found."})
    }else{
      res.status(200).json(data);
    }
  })
  .catch(err=>console.log(err))
})


// get data according to the intrest
router.post("/songlistfix", loginrequire, ( req, res )=>{
const  {mood, language, songtype } = req.body;
console.log(req.body);
songer.find({mood, language, songtype})
.then(data=>{
  if(!data[0]){
    res.status(401).json({error:"Origenal type not found."})
  } else{
   
    res.status(200).json(data);
  }
})
.catch(err=>console.log(err))
})

router.post("/songlistall", loginrequire, ( req, res )=>{
  songer.find()
.then(data=>{
  if(!data[0]){
    res.status(401).json({error:"Somthing went wrong."})
  } else{
    res.status(200).json(data);
  }
})
.catch(err=>console.log(err))
})




//history
router.post("/insert-history", loginrequire, ( req, res )=>{
  const { playlistId } = req.body;

  historye.find({owner:req.user.id})
  .then(data=>{
    if(!data[0]){
      const Historye = new historye({
        owner:req.user.id
        
      })
      Historye.save()
      .then(s=>{
        res.status(200).json({data:s})
      })
      .catch(err=>console.log(err))

    } else{
      historye.find({owner:req.user.id, history:{ $elemMatch:{playlistId} } })
      .then(m=>{
        if(m[0]){
          res.status(200).json({data:m})
        }else{
          //
          historye.findOneAndUpdate({owner:req.user.id}, { $push: { history: {playlistId} } })
          .then(u=>{
            res.status(200).json({data:u});
          })
          .catch(err=>console.log(err))
         }
      }) 
    }

  }) //then end
  .catch(err=>console.log(err))
})




//get history
router.post("/get-history", loginrequire, ( req, res )=>{
  historye.find({owner:req.user.id})
  .then(data=>{
    if(!data[0]){
      res.status(400).json({error:"Somthing going wrong."})
    } else{
      res.status(200).json(data)
    }
  })
})



//update data user profile picture

router.patch("/patchprofile", loginrequire, async(req, res )=>{
  const {id} = req.user;
  const { profile } = req.body;
 await user.findByIdAndUpdate( id, {profile:profile}, {useFindAndModify: false} )
 .then(data=>{
   res.status(200).json(data)
 })
 .catch(err=>console.log(err))

})



// user details
router.post("/userdetails", loginrequire, ( req, res )=>{
const { user } = req;
res.status(200).json(user);
})

// update name
router.patch("/patchname", loginrequire, async(req, res )=>{
  const {id} = req.user;
  const { name } = req.body;
 await user.findByIdAndUpdate( id, {name}, {useFindAndModify: false} )
 .then(data=>{
   res.status(200).json(data)
 })
 .catch(err=>console.log(err))

})

//password update



router.put("/passwordupdate", loginrequire, ( req, res )=>{
const { id } = req.user;
const { password, newpassword } = req.body;
user.findById(id)
.then(data=>{
  
 
    // res.status(200).json(data)

 bcrypt.compare(password, data.password)
 .then(domatch=>{
   if(!domatch){
     res.status(200).json({error:"The password is not match."})
   } else {
     //const saltRounds=10;
     bcrypt.hash(newpassword, saltRounds)
     .then(has=>{
       if(!has){
         res.status(500).json({error:"Internal error."})
       } else {
         user.findByIdAndUpdate( id, { password: has }, { useFindAndModify: false })
         .then(chan=>{
           if(!chan){
             res.status(500).json({error:"It has some internal error."})
           } else{
             res.status(200).json({message:"Data is update successfully."})
           }
         }) //end of the then part findByIdAndUpdate
         .catch(err=>console.log(err))
       }
     }) //end of  the hash password
     .catch(err=>console.log(err))
    
   }
 })
  
}) // findById end of then
.catch(err=>console.log(err))
})

//like insert in song
router.post("/insert-like", loginrequire, (req,res)=>{
  const { id } = req.user;
  const { playlistId } = req.body;

  songer.findOne({_id: playlistId, like:{ $elemMatch:{userid:id} } })
  .then(data=>{
if(!data){
  songer.findByIdAndUpdate( playlistId, { $push: { like: {userid:id} } }, { useFindAndModify: false })
  .then(suc=>{
    if(suc){
      res.status(200).json({data:"Successfully inserted"})
    }else{
      res.status(500).json({error:"Internal server Error"})
    }
    
  })
  .catch(err=>console.log(err))
}else {
  res.status(200).json({get:"Already have."})
}
  })
  .catch(err=>console.log(err))
  
})

//remove your like from the song list
router.patch("/likeremover", loginrequire, ( req, res )=>{
  const { id } = req.user;
  const { playlistId } = req.body;
  songer.findOne({_id:playlistId, like:{ $elemMatch:{ userid:id }}})
  .then(f=>{
    if(!f){
      res.status(200).json({NotFound:"Data is not preasent in the list"})
    } else {
      songer.findByIdAndUpdate(playlistId, { $pull: { like: {userid:id} } }, { useFindAndModify: false })
      .then(data=>{
        if(!data){
          res.status(400).json({error:"Somthing went wrong."})
        } else {
          res.status(200).json({data:"Successfully deleted."})
        }
      })
      .catch(err=>console.log(err))
    }
  })
  .catch(err=>console.log(err))
  
})

//According to the play list find user is like or not

router.post("/find-user-like-or-not", loginrequire, ( req, res )=>{
  const { id } = req.user;
  const { playlistId } = req.body;
  songer.findOne({_id: playlistId, like:{ $elemMatch:{userid:id} } })
  .then(data=>{
    if(data){
      res.status(200).json({data:"Data is found"})
    }else{
      res.status(200).json({NotFound:"Data is not found"})
    }
  })
  .catch(err=>console.log(err))
  
})

//Found all song whoes are like by user
router.post("/getalllike", loginrequire, ( req, res )=>{
  const { id } = req.user;
  songer.find({like:{$elemMatch:{userid:id}}})
  .then(data=>{
    if(!data[0]){
      res.status(400).json({error:"No data is found."})
    } else {
      res.status(200).json(data)
    }
  })
  .catch(err=>console.log(err))
})



module.exports=router;
