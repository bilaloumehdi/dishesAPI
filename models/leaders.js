const mongoose = require('mongoose') ;
const leaderSchema = new mongoose.Schema({
    name:{
        type:String ,
        required:true ,
        unique:true ,
    },
    image:{
        type:String,
        required:true ,
    },
    designation:{
        type:String,
        default:''
    },
    abbr: {
        type:String,
        required:true,
    },
    description:{
        type:String ,
        default:'',
    },
    featured:{
        type:Boolean,
        default:false,
    }
})

module.exports = mongoose.model('Leaders',leaderSchema) ;