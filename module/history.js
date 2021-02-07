const mongoose=require("mongoose");
// const user = require("./user");


const schema= mongoose.Schema({
owner:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
},
 history: [
     { playlistId: {
     type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'}
}
]
});
module.exports = mongoose.model("History", schema);