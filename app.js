const express = require('express');
const mongoose = require('mongoose') ;
const passport = require('passport')
const session = require('express-session') 
// const FileStore = require('session-file-store')(session)
const authenticate = require('./authenticate');
// routers
const dishRouter = require('./routers/dishRouter');
const promoRouter = require('./routers/promoRouter');
const leaderRouter = require('./routers/leaderRouter');
const userRouter = require('./routers/userRouter') ;
const uploadRouter = require('./routers/uploadRouter');

const app = express();

/**
 * set a middelware to redirect every request to Secure port
 * if the request is comming from a secure port --->  req object has a field 'req.secure'
 */
app.all('*',(req,res,next) => {
    if(req.secure){
        return next()
    }
    res.redirect(307,`https://${req.hostname}:${app.get('secPort') }${req.url}`);
})
const PORT = 3000; 
const url  = require('./config').Mongo_URL ;

// middelwares
app.use(express.json())
app.use(express.urlencoded({extended: true})) ;
app.use(express.static('./public'))
// app.use(session({
//     name:"session-id",
//     secret:'79262EJOA7730' ,
//     resave:false, 
//     saveUninitialized:false,
//     store: new FileStore(),
//     // cookie:{secure: true} ,// cookie(session-id) --> will be hiden

// }));

app.use(passport.initialize());
// app.use(passport.session());

// function auth(req,res,next){
//     console.log(req.user)
//     if(!req.user){
//         const err = new Error('You are not authenticated'); 
//         next(err);
//     }
//         next()
// }

app.use('/users', userRouter) ;
// app.use(auth);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);


mongoose.connect(url)
.then(() => {
    console.log('connected to the server ...') ;
})

module.exports = app;