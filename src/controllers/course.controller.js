import CourseModel from '../models/course.model.js';
import UserModel from '../models/user.model.js';
import decodeJwt from '../services/auth.service.js'
import generatePdf from '../services/pdf.service.js'


export default class CourseController {

    static async createDefaultCourse() {

        const courseRepeat = await CourseModel.findOne({ name: "default", description: "Default course for students" });
        if( !courseRepeat ) await CourseModel.create({ name: "default", description: "Default course for students" });
    
    }

    static async add({ name, description }) {

        const course = new CourseModel({
            name: name,
            description: description
        });

        try {
            const courseRepeat = await CourseModel.findOne({ name: name });
            if( courseRepeat ) return { added: false, error: 'Course already exists' };
            await course.save();

            return { added: true, item: course };

        } catch(error) {
            return { added: false, error: error };
        }

    }


    static async updateById( courseId, updateData, token ) { 

        const userId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const userCourses = (await UserModel.findById( userId )).courses;
            if( !userCourses.includes( courseId ) ) return { updated: false, error: 'Course not found' };

            const data = await CourseModel.findByIdAndUpdate( courseId, updateData );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };

            return { updated: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async deleteById( courseId, token ) { 

        const userId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const userCourses = (await UserModel.findById( userId )).courses;
            if( !userCourses.includes( courseId ) ) return { updated: false, error: 'Course not found' };

            const data = await CourseModel.findByIdAndDelete( courseId );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };

            await UserModel.findByIdAndUpdate( userId, { $pull: {courses: courseId} } );

            const defaultCourseId = ( await CourseModel.findOne({ name: 'default' }) ).id;
            await UserModel.updateMany( { courses: courseId }, { "$set":{ "courses.$[id]": defaultCourseId } }, { arrayFilters: [{ 'id': courseId }] } );
            
            return { deleted: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async generatePdf( filename, token ) {

        const userId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const user = await UserModel.findById( userId ).populate('courses');
            const data = generatePdf( filename, user );
            return data;
            
        } catch (error) {
            return error;
        }
        
    }

}