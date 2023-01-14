const mongoose = require('mongoose') ;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        default:'' ,
    },
    lastname:{
        type:String,
        default:''
    },
    facebookId: String,
    admin:{
        type:Boolean,
        default:false ,
    }
}) 
userSchema.plugin(passportLocalMongoose) ; // will add username and password fields automatically 
module.exports = mongoose.model('users',userSchema)