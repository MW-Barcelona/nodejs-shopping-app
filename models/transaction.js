const Joi = require('joi');
const mongoose = require('mongoose');
const { itemSchema } = require('./item');

const customUserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 10,
        maxlength: 50,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            'Please fill a valid email address'],
        required: 'Email address is required.'
    }
})

const customItemSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 10,
        maxlength: 255,
        required: true,
    }
})

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    items: {
        type: [ customItemSchema ],
        validate: [ v => v.length <= 5, 'Only up to 5 items allowed!' ]
    },
    buyer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 10,
                maxlength: 50,
                required: true,
            },
            email: {
                type: String,
                trim: true,
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
                    'Please fill a valid email address'],
                required: 'Email address is required.'
            },
            number: {
                type: String,
                minlength: 7,
                maxlength: 11, 
                required: true
            }
        })
    },
    seller: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 10,
                maxlength: 50,
                required: true,
            },
            email: {
                type: String,
                trim: true,
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
                    'Please fill a valid email address'],
                required: 'Email address is required.'
            },
            number: {
                type: String,
                minlength: 7,
                maxlength: 11, 
                required: true
            }
        })
    },
    totalAmount: {
        type: Number,
        default: 0.00,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

function validateTransaction(t) {
    const schema = {
        name: Joi.string().min(10).max(50).required(),
        number: Joi.string().min(7).max(11).required(),
    }

    return Joi.validate(user, schema)
}

exports.Transaction = Transaction;
exports.transactionSchema = transactionSchema;
exports.validate = validateTransaction;