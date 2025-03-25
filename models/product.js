import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    stock:{
        required:true,
        type:Number
    },
    description: String,
    imageUrl: String,
    category: String
});

export default mongoose.model('Product', productSchema);