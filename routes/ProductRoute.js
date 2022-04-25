const router = require('express').Router();
const { Model } = require('mongoose');
const verifyToken = require('../middleware/VerifyToken');
const Product = require('../model/Product');

// @route POST api/product
// @desc Add a product
// @access Private
router.post('/', async (req, res) => {
    const { image, name, price, total, desc } = req.body;

    if (!image || !name || !price || !total || desc) {
        return res
            .status(400)
            .json({ success: false, message: 'Product missing property' });
    }

    try {
        const user = await Product.findOne({ name });

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: 'Product already taken' });
        }

        const newProduct = new Product({
            image,
            name,
            price,
            total,
            desc,
        });
        await newProduct.save();
        return res.status(200).json({
            success: true,
            message: 'Add product successfully',
            product: newProduct,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route GET api/product
// @desc Get all product
// @access Private
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({ success: true, products });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route GET api/product
// @desc Get a product
// @access Private
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.id });
        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route PUT api/product
// @desc Update product
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
    const { image, name, price, total, desc } = req.body;

    if (!image || !name || !price || !total) {
        return res
            .status(400)
            .json({ success: false, message: 'Product missing property' });
    }

    try {
        let updatedProduct = {
            image,
            name,
            price,
            total,
            desc: desc || '',
        };

        // {new: true} to return updated product
        updatedProduct = await Product.findOneAndUpdate(
            { _id: req.params.id },
            updatedProduct,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(401).json({
                success: false,
                message: 'Product not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route DELETE api/product
// @desc Delete product
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleteProduct = await Product.findOneAndDelete({
            _id: req.params.id,
        });

        if (!deleteProduct) {
            return res.status(401).json({
                success: false,
                message: 'Product not found',
            });
        }
        return res
            .status(200)
            .json({ success: true, message: 'Delete product successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
