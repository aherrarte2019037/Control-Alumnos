import express from 'express';
import CourseController from '../controllers/course.controller.js'
import AuthMiddleware from '../middlewares/auth.middleware.js'


const router = express.Router();


router.post('/', AuthMiddleware.authorizeTeacher, async(req, res) => {

    try {
        const data = req.body;
        const response = await CourseController.add( data );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({ added: false, error: error });
    }

});


router.put('/:id', AuthMiddleware.authorizeTeacher, async(req, res) => {

    try {
        const courseId = req.params.id
        const data = req.body;
        const token = req.headers.authorization;
        const response = await CourseController.updateById( courseId, data, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);   
    }

});


router.delete('/:id', AuthMiddleware.authorizeTeacher, async(req, res) => {

    try {
        const courseId = req.params.id
        const data = req.body;
        const token = req.headers.authorization;
        const response = await CourseController.deleteById( courseId, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);   
    }

});


router.post('/service/pdf', AuthMiddleware.authorizeUser, async(req, res) => {

    try {
        const filename = req.body.filename;
        const token = req.headers.authorization;
        const response = await CourseController.generatePdf( filename, token );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${response.filename}`);
        response.doc.pipe(res);

    } catch(error) {
        res.status(500).send({ error: 'Pdf generated failed' })
    }

});


export default router;