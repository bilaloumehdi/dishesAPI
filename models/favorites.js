const mongoose = require('mongoose');

const favoritesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    dishes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'dishes'
    }

})

module.exports = mongoose.model('favorites',favoritesSchema)