const jwt = require('jsonwebtoken');
require('dotenv').config()

const authModel = require('../Model/model.auth');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtKey = process.env.JTWKEY;

// const validateUsers = async (req, res, next) => {
//     const headers = req.headers;
//     const tokenFromHeaders = headers.authorization.split(" ")[1];
//     // console.log(tokenFromHeaders);
//     /**
//      * Points to be validated in token
//      * 1. Token should be present
//      * 2. Secret key validation (This is the same token that we have generated)
//      * 3. Token expiry date should not be passed
//      * 4. Validate the issued at date (Optional)
//      * 5. Validate the user id if it is present in database
//      */

//     // 1
//     if (!tokenFromHeaders) {
//         return res.status(401).json({
//             message: "Unauthenticated user"
//         })
//     }

//     //2
//     try {
//         jwt.verify(tokenFromHeaders, jwtKey)
//     } catch (err) {
//         return res.status(401).json({
//             message: "Unauthenticated user"
//         })
//     }

//     // //3
//     const tokenData = jwt.decode(tokenFromHeaders);
//     // console.log(tokenData);

//     const tokenExp = tokenData.exp;
//     const current = Math.ceil(new Date().getTime() / 1000);

//     if (current > tokenExp) {
//         return res.status(401).json({
//             message: "Unauthenticated user"
//         })
//     }

//     //4 
//     const tokenIat = tokenData.iat;
//     const maxTokenAge = 60 * 60 * 27 * 7;

//     if (current - tokenIat > maxTokenAge) {
//         return res.status(401).json({ message: "Token too old" });
//     }


//     //5 
//     const userId = tokenData.userId;
//     try {
//         const user = await authModel.findById(userId);
//         if (!user) {
//             return res.status(401).json({
//                 message: "Unauthenticated user"
//             })
//         }
//         req.user = user;
//     } catch (err) {
//         res.json({
//             message: 'Internal Server Error'
//         })
//     }
//     next() // after clear all check proceed to nextMiddleware
// }

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtKey;
console.log(opts);

const strategy = new JwtStrategy(opts, async function (jwt_payload, done) {
    const userId = jwt_payload.userId;
    const user = await authModel.findById(userId);

    if (!user) {
        return done("Invalid user", false);
    }

    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
        // or you could create a new account
    }

});

passport.use(strategy);

module.exports = passport;