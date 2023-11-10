const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    name:{
        type: String,   
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
 phoneNumber:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    Role:{
        type :String ,  
        default:'Admin',
    },
}, {timestamps:true});

const User = mongoose.model("User", userSchema);
module.exports = User