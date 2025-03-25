import express from "express";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        if (!cart) return res.status(404).json({ message: 'cart not found' })
        res.status(200).json(cart)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/empty/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'cart not found' });
        cart.items = []
        cart.total = 0
        await cart.save()
        res.status(200).json({ message: 'cart emptied' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id/add-product/:prodId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'cart not found' });
        const product = await Product.findById(req.params.prodId);
        if (!product) return res.status(404).json({ message: 'product not found' });

        const existingItem = cart.items.find(item => item.productId.toString() === product._id.toString());

        if (existingItem) {
            cart.items = cart.items.map(item =>
                item.productId.toString() === product._id.toString()
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            cart.items = [...cart.items, { productId: product._id, quantity: 1 }];
        }

        const newCart = await cart.save();
        res.status(200).json(newCart);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id/remove-product/:prodId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'cart not found' });
        const product = await Product.findById(req.params.prodId);
        if (!product) return res.status(404).json({ message: 'product not found' });
        cart.items = cart.items.filter(item =>  String(item.productId) != String(product._id))
        const newCart = await cart.save();
        res.status(200).json(newCart);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id/quantity/:prodId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'cart not found' });
        const product = await Product.findById(req.params.prodId);
        if (!product) return res.status(404).json({ message: 'product not found' });
        if (req.body.quantity < 1){
            cart.items = cart.items.filter(item =>  String(item.productId) != String(product._id))
            const newCart = await cart.save();
            return res.status(200).json(newCart);
        }

        cart.items = cart.items.map(item => String(item.productId) === String(product._id) ? { productId: product._id, quantity: req.body.quantity } : item)

        const newCart = await cart.save();
        res.status(200).json(newCart);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router