const express= require("express");
// const { post } = require("./entery");
const songer = require("../module/song");
const router = express.Router();

router.post("/playlistadded", (req, res)=>{
    const { mood, language, songtype, album, song, poster, songname } = req.body;
    // res.json({message:req.body})
if( !mood || !language || !songtype || !album || !song || !poster || !songname){
    res.status(401).json({message:"You can't leave the empty space."})
}
songer.find({songname:songname})
.then(data =>{
    // console.log(data[0]);
    if(!data[0]){
        const Songer = new songer({
            mood,
            language,
            songtype,
            album,
            song,
            poster,
            songname
        });
        Songer.save()
        .then(s=>{
            res.status(200).json({message:"Data is save successfully",
        songDetails:s})
        })
        .catch(err=>console.log(err))
    }else{
        res.status(400).json({message:"This name is alredy exite."})
    } 
})
.catch(err=>console.log(err))

})

module.exports = router;