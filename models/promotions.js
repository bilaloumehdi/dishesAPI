const mongoose = require('mongoose');
const promoSchema = new mongoose.Schema({
    name:{
        type:String ,
        required:true, 
    },
    image:{
        type:String ,
        required:true, 
    },
    label:{
        type:String ,
        default:false, 
    },
    price:{
        type: Number ,
        required:true,
        min:0
    },
    description :{
        type:String ,
        required:true, 
    },
    featured:{
        type:Boolean ,
        default:false, 
    },
})

module.exports = mongoose.model('Promotion',promoSchema) ;