const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
var db = mongoose.connect(config.db);

//db.connection.on('connected',()=> console.log("connected to database")) 

const app = express();
const port = 3000;

const users = require('./routes/users');
app.use(express.static(path.join(__dirname,'public')));
//cors used to any domain can access 
app.use(cors());

//Body parser middle waare
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// maping user routes
app.use('/users',users);

app.use('/',(req,res)=>{
    res.render("Home");
});
app.use("*",(req,res)=> {
    res.sendFile(path.join(__dirname,'angular-src/src/index.html'));
})


app.listen(port , () => console.log("server started on "+port));
