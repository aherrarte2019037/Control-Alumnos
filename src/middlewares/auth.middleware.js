import Passport from 'passport';


export default class AuthMiddleware {

    static registerUserAdmin( req, res, next ) {

        if( req.body.role === 'ROL_MAESTRO' ) {
            Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

                if(error || !user || user.role === 'ROL_ALUMNO') {
                    res.status(500).send('Unauthorized');
        
                } else {
                    next();
                }
        
            })(req, res, next);

        } else {
            next();
        }

    }


    static authorizeUser( req, res, next ) {

        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

            if( error || !user ) {
                res.status(500).send('Unauthorized');
        
            } else {
                next();
            }
        
        })(req, res, next);

    }


    static authorizeTeacher( req, res, next ) {

        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

            if( error || !user || user.role === 'ROL_ALUMNO' ) {
                res.status(500).send('Unauthorized');
        
            } else {
                next();
            }
        
        })(req, res, next);

    }

}