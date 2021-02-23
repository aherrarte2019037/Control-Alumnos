import mongoose from 'mongoose';


const CourseSchema = mongoose.Schema({
    name       : { type: String, required: [true, 'Name is required'], maxLength: 30 },
    description: { type: String, required: [true, 'Description is required'], maxLength: 100 },
});


export default mongoose.model('Course', CourseSchema);