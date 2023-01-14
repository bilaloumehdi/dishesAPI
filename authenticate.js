
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwt = require('jsonwebtoken');
const facebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/users');
const config = require('./config');



module.exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports.getToken = (user) => {
    return jwt.sign(user, config.secrectKey, {
        expiresIn: 3600
    })
}
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secrectKey;


module.exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id })
        .then((user) => {
            if (!user) {

                return done(null, false)
            }
            else {
                return done(null, user)
            }
        }).catch(err => {
            return done(err, false)
        })
}))

module.exports.verifyUser = passport.authenticate('jwt', { session: false })

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin === true) {
        next()
    }
    else {
        const err = new Error('You are not authorized to perform this operation')
        res.statusCode = 403;
        res.setHeader('content-Type', 'application/json');
        next(err)
    }

}

exports.facebookPassword = passport.use(new facebookTokenStrategy({
    clientID: config.facebook.clienId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err)
            return done(err, false);
        if (!err && user !== null)
            return done(null, user)
        else {
            let user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save()
            .then((user) => done(null,user))
            .catch(err => done(err,false))
        }   

    })
}

))