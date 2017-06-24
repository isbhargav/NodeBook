const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');


router.get('/register',(req,res,next) => {
res.send("Register");
});

//Register
router.post('/register',(req,res,next)=> {
    let newuser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newuser,(err,user)=> {
        if(err)
            res.json({succes: false ,message: "failed to register user" });
        else
            res.json({succes: true ,message: "user registered" });
    });
});
//Authenticate
router.post('/login',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username,(err,user)=>
    {
        if(err)
            throw err;
        if(!user)
            return res.json({succes: false , message : "user not found"});
        
        User.comparePassword(password,user.password,(err,ismatch)=>{
            if(err)
                throw err;
            if(ismatch)
            {
                const token = [jwt.sign(user,config.secret,{
                    expiresIn:60400
                })];
                res.json({
                    succes: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username
                    }
                })
            }
           
        })
    })

});

// Profile
router.get('/profile',passport.authenticate('jwt',{session:false}) ,(req,res,next)=> {
    res.json(req.user);
})

module.exports = router;