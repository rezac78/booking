const mongoose = require('mongoose');
const {schema} =require('./secure/userValidation');
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})



UserSchema.statics.userValidation = function (body) {
    return schema.validate(body,{abortEarly:false})
}

module.exports = mongoose.model("User", UserSchema);