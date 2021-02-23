import dotenv from 'dotenv'
import db from './db.js';
import express from 'express';
import UserRoutes from './routes/user.routes.js'
import AppRoutes from './routes/app.routes.js'
import UserController from './controllers/user.controller.js'
import CourseController from './controllers/course.controller.js';
import Passport from 'passport';
import CourseRoutes from './routes/course.routes.js'
import './services/auth.service.js';

//Iniciar Autenticación
Passport.initialize();


//Variables
const app = express();


//Configurar Servidor
dotenv.config();
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );


//Conectar a DB
db.connect();


//Rutas
app.use( '/api', AppRoutes );
app.use( '/api/user', UserRoutes );
app.use( '/api/course', CourseRoutes );


//Iniciar Servidor
app.listen( process.env.SERVER_PORT , () => {
    console.log(`Servidor en el puerto ${process.env.SERVER_PORT}`);
    UserController.createAdminUser();
    CourseController.createDefaultCourse();
});