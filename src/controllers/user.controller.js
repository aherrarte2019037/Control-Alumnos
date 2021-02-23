import UserModel from '../models/user.model.js';
import CourseModel from '../models/course.model.js'
import decodeJwt from '../services/auth.service.js'

export default class UserController {

    static async createAdminUser() {

        const userRepeat = await UserModel.findOne({ firstname: 'MAESTRO', lastname: 'MAESTRO', role: 'ROL_MAESTRO', email: 'maestro@maestro.com.gt' });
        if( !userRepeat ) await UserModel.create({ firstname: "MAESTRO", lastname: "MAESTRO", age: 18, role: "ROL_MAESTRO", email: "maestro@maestro.com.gt", password: "123456" });
    
    }


    static async getUser( id ) {

        try {
            const data = await UserModel.findById( id ).populate('courses', 'name');
            if( !data || data.length === 0 ) return { error: 'Data not found' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }
    

    static async register({ firstname, lastname, age, role, email, password }) {
        const user = new UserModel({
            firstname: firstname,
            lastname: lastname,
            age: age,
            role: role,
            email: email,
            password: password
        });

        try {
            const userRepeat = await UserModel.findOne({ email: email });
            if( userRepeat ) return { registered: false, error: 'Email already exists' };
            await user.save();
            const response = {...user}._doc
            delete response.password
            return { registered: true, item: response };

        } catch(error) {
            return { registered: false, error: error.message };
        }  
        
    }


    static async assignCourse( id, course ) {

        try {
            
            const courseExists = await CourseModel.findOne({ $or: [ {name: new RegExp(`^${course}$`, 'i') }, {_id: course} ] });
            if( !courseExists ) return { assigned: false, error: 'Course not found' };

            const user = await UserModel.findById( id );
            if( !user ) return { assigned: false, error: 'User not found' };

            if( user.courses.length >= 3 && user.role === 'ROL_ALUMNO' ) return { assigned: false, error: 'Maximum 3 courses' };

            const courseAssigned = user.courses.includes( courseExists.id )
            if( courseAssigned ) return { assigned: false, error: 'Course already assigned' };

            const userUpdated = await UserModel.findByIdAndUpdate( id,{  $push: {courses: courseExists.id}  } );
            return { assigned: true, item: userUpdated };

        } catch(error) {
            return { assigned: false, error: error }
        }

    }


    static async updateById( updateData, token ) { 

        const id = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await UserModel.findByIdAndUpdate( id, updateData );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };
            return { updated: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async deleteById( token ) {

        const id = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await UserModel.findByIdAndDelete( id );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };
            return { deleted: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }

}