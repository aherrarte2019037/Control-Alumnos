import express from 'express';
import UserController from '../controllers/user.controller.js'
import Passport from 'passport';
import AuthMiddleware from '../middlewares/auth.middleware.js'


const router = express.Router();


router.post('/register', AuthMiddleware.registerUserAdmin, async(req, res) => {
    
    const data = req.body;
    const response = await UserController.register( data );
    res.send( response );
    
});


router.post('/login', (req, res) => {

    Passport.authenticate( 'authenticate_user', {session: false}, (error, user, message) =>{
        
        if(error || !user) {
            res.status(500).send(message);

        } else {
            res.status(200).send(message);
        }

    })(req, res);

});


router.get('/:id', async(req, res) => {

    try {
        
        const id = req.params.id;
        const response = await UserController.getUser( id );
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error);
    }

});


router.post('/:id', async(req, res) => {

    try {

        const id = req.params.id;
        const course = req.body.course;
        const response = await UserController.assignCourse( id, course );
        res.status(200).send(response);
        
    } catch(error) {
        res.status(500).send(error);
    }

});


router.put('/', AuthMiddleware.authorizeUser, async(req, res) => {

    try {
        const data = req.body;
        const token = req.headers.authorization;
        const response = await UserController.updateById( data, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);   
    }

});


router.delete('/', AuthMiddleware.authorizeUser, async(req, res) => {

    try {
        const token = req.headers.authorization;
        const response = await UserController.deleteById( token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);   
    }

});


export default router;