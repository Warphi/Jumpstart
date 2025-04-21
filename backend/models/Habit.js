const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// base habit model
const habit = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    repeats: [{
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    }],
    dateTime: {
        type: Date,
    },
    completeBy: {
        type: Date,
    },
    completedDates: [{
        type: Date,
        default: [],
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Habit', habit);