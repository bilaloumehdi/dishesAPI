const express = require('express')
const userRouter = express.Router();
const authenticate = require('../authenticate');
const passport = require('passport');
const User = require('../models/users');
const cors = require('./cors')

userRouter.use(express.json())

userRouter.route('/')
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        User.find({})
            .then(user => {
                res.status(200).json({ success: true, user })
            }).catch(err => {
                next(err)
            })

    })
userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {

    User.register(new User({ username: req.body.username }), req.body.password)
        .then((user) => {

            if (req.body.firstname)
                user.firstname = req.body.firstname;
            if (req.body.lastname)
                user.lastname = req.body.lastname;

            user.save().then(user => {
                passport.authenticate('local')(req, res, () => {

                    return res.status(201).json({ success: true, status: 'Registration Successfull! ' })
                })
            })
        })
        .catch(err => {
            res.status(500).json({ err: err.message })
        })

})
userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), (req, res, next) => {

    const token = authenticate.getToken({ _id: req.user._id })


    res.status(200).json({ success: true, token: token, status: 'You are successfully logged in! ' })
})

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
    // if(!req.session){
    //     req.session.destroy((err) => {
    //         return err ;
    //     }) ;
    // }
    req.logOut({ keepSessionInfo: false },
        (err) => res.status(404).json({ success: false, status: "You are not logged in" }));
    res.redirect('/dishes')
})

userRouter.get('facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        const token = authenticate.getToken({ _id: req.user._id });
        res.status(200).json({ success: true, token: token, status: 'You are successfully logged in! ' });
    }
})

module.exports = userRouter;
