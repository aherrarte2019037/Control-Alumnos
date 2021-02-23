import Passport from 'passport';
import PassportJwt from 'passport-jwt';
import Jwt, { decode } from 'jsonwebtoken';
import { Strategy } from 'passport-local';
import dontenv from 'dotenv';
import UserModel from '../models/user.model.js'

dontenv.config();


const AuthFields = {
    usernameField: 'email',
    passwordField: 'password'
};


const JwtOptions = {
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}


Passport.use( 'authenticate_user', new Strategy( AuthFields, async(email, password, done) =>{

    try {
        const user = await UserModel.findOne({ email: email });
        if( !user ) return done(null, false, { logged: false, error: 'Wrong email or password' });
        if( !await user.validPassword(password) ) return done(null, false, { logged: false, error: 'Wrong email or password' });

        return done(null, user, { logged: 'true', item: user, jwt: getUserToken(user) });

    } catch(error) {
        return done(null, false, { error: error });
    }

}));


Passport.use( 'authorize_user', new PassportJwt.Strategy( JwtOptions, async(jwtPayload, done) =>{

    try {
        const user = await UserModel.findById( jwtPayload.sub );
        return done( null, user, { authorized: true } );

    } catch(error) {
        return done(error, false, { authorized: false, error: error })
    }

}));


function getUserToken( user ) {
    return Jwt.sign({
        role: user.role,
        iss: user.firstname,
        sub: user.id
    }, process.env.JWT_SECRET);
};


function decodeJwt( jwt ) {
    return Jwt.decode( jwt );
}


export default decodeJwt;