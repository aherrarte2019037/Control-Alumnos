import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    firstname    : { type: String, required: [true, 'Firstame is required'], maxLength: 30 },
    lastname     : { type: String, required: [true, 'Lastname is required'], maxLength: 30 },
    age          : { type: Number, required: [true, 'Age is required'], min: 1, max: 100 },
    role         : { type: String, enum: ['ROL_MAESTRO', 'ROL_ALUMNO'], default: 'ROL_ALUMNO' },
    email        : { type: String, required: [true, 'Email is required'], maxLength: 254 },
    password     : { type: String, required: [true, 'Password is required'], mingLength: 8, maxLength: 30 },
    courses      : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});


UserSchema.pre( 'save', async function(next) {
    const user = this;

    if( !user.isModified('password') ) return next(); 

    const hashPassword = await bcrypt.hash( user.password, 10 );
    user.password = hashPassword;
});


UserSchema.methods.validPassword = async function(password) {
    return await bcrypt.compare( password, this.password )
};


UserSchema.methods.toJSON = function() {
    const user = this;
    const response = user.toObject();
    delete response.password;
    return response;
};


export default mongoose.model('User', UserSchema);