const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
var uniqueValidator = require('mongoose-unique-validator');

//userSchema
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
UserSchema.plugin(uniqueValidator);

const User = module.exports =mongoose.model('User',UserSchema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
} 

module.exports.getUserByUsername = function(username,callback)
{
    let query={username: username};
    User.findOne(query,callback);

}

module.exports.addUser = function(newuser,callback)
{
    bcrypt.genSalt(10,(err,salt)=> {
        bcrypt.hash(newuser.password,salt,(err,hash) => {
            if(err)
                throw err;

            newuser.password=hash;
            newuser.save(callback);
        });
    });

}
module.exports.comparePassword =function(opass,hash,callback)
{
    bcrypt.compare(opass,hash,(err,ismatch)=> {
        if(err)
            throw err;
        callback(null,ismatch);
    })
}