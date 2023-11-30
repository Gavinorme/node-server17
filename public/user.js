const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type: String,
        requore: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});


module.exports = mongoose.model("User", UserSchema);