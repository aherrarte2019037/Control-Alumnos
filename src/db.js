import mongoose from 'mongoose';

let dbState;

function connect() {
    
    const USER = process.env.DB_USER;
    const PASS = process.env.DB_PASS;
    const PORT = process.env.DB_PORT;
    const DB = process.env.DB_NAME;

    mongoose.Promise = global.Promise;
    mongoose.set('returnOriginal', false);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    mongoose.connect( `mongodb://${USER}:${PASS}@localhost:${PORT}/${DB}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then( () => console.log('Conexión Exitosa') )
    .catch( (error) => console.log(`Conexión Fallida: ${error}`) );
    
    dbState = mongoose.connection;
    
}

export default { connect }