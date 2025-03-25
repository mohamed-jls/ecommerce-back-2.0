import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    total: {
        type: Number,
        default: 0
    }
});

cartSchema.pre('save', async function (next) {

    let total = 0;
    for (let item of this.items) {
        const product = await mongoose.model('Product').findById(item.productId);
        total += item.quantity * product.price;
    }
    this.total = total;
    next();
})

export default mongoose.model('Cart', cartSchema);
