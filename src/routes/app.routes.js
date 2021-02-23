import express from 'express';


const router = express.Router();


router.get('/', (req, res) => {

    res.status(200).send('Student Control Api V1........Author: Angel Herrarte');
    
});


export default router;