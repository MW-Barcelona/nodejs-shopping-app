const express = require('express');
const { User } = require('../models/user');
const { Item, validate } = require('../models/item');
const { Category } = require('../models/category');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const seller = require('../middleware/seller');
const router = express.Router();


// Show all products 
router.get('/', async (req, res) => {
    const items = await Item.find().sort('name');
    res.send(items);
})

router.get('/:id', async (req, res) => {
    const item = await Item.findById(req.params.id)

    if (!item) {
        return res.status(404).send('Item not found.')
    }

    console.log(item)
    res.json(item);
})

// Buyer: Show products by category
router.get('/category/:id', async (req, res) => {
    const item = await Item
        .find({ 'category._id': req.params.id })
        .sort('name');

    if (!item) {
        return res.status(404).send('Item not found.')
    }

    res.send(item);
})

// Buyer: Show products by seller
router.get('/seller/:id', async (req, res) => {
    const item = await Item
        .find({ 'seller._id': req.params.id })
        .sort('name');

    if (!item) {
        return res.status(404).send('Item not found.')
    }

    res.send(item);
})


// Seller: Get Low Stock Products
router.get('/lowstock', auth, seller, async (req, res) => {
    const products = await Item.find({ 'quantity': { '$lt': 5 } })
    if (!products) {
        res.send('You have no low stock products!');
        return;
    }
    res.send(products);
})

// Seller: Add new product
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send('Invalid request.');

    // Check if seller product list exceeds 20 items
    let _seller = await User.findById(req.user.id);
    if (_seller.productList.length === 20) {
        return res.status(400).send('Max number of items reached')
    }

    let _category = await Category.findById(req.body.categoryId);
    let item = new Item({
        name: req.body.name,
        category: _category,
        description: req.body.description,
        quantity: req.body.quantity,
        unitPrice: req.body.unitPrice,
        imgUrl: req.body.imgUrl,
        seller: _seller
    })

    // Add item to product list
    _seller.productList.push(item);
    await _seller.save();

    await item.save();
    res.send('Item successfully saved!');
})

// Seller: Edit product
router.put('/:id', auth, seller, async(req, res) => {
    let { error } = validate(req.params.body);
    if (error)
        return res.status(400).send('Item not found.');

    const _category = await Category.findById(req.body.categoryId);
    if (!_category) 
        return res.status(400).send(`Category not found with id ${req.body.categoryId}`);

    const item = await Item.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        category: _category,
        description: req.body.description,
        quantity: req.body.quantity,
        unitPrice: req.body.unitPrice,
    });

    if (!item) 
        return res.status(404).send('Item not found.');
    
    res.send('Item successfully saved.');
})

// Seller: Delete product
router.delete('/:id', auth, seller, async(req, res) => {
    const item = await Item.findByIdAndRemove(req.params.id);
    if (!item) 
        return res.status(404).send('Item not found.');

    res.send(`${item.name} successfully deleted.`);
})


module.exports = router;