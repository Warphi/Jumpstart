const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');

// middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // check authorization header for token by grabbing the second element of the split array
    if (!token) {
        return res.status(401).json({ error: 'Missing auth token.'}); // 401 is unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token.' }); // 401 is unauthorized
    }
}

// POST /habits (create a habit)
router.post('/', authenticate, async (req, res) => {
    const { name, priority, description, repeats, startDate } = req.body;

    try {
        const newHabit = await Habit.create({
            name,
            priority,
            description,
            repeats,
            startDate,
            userId: req.userId,
            completedDates: []
        });

        res.status(201).json({ habit: newHabit }); // 201 is created
    } catch (err) {
        res.status(500).json({ error: "Error creating new habit."}); // 500 is internal server error
    }
});

// DELETE /habits/:id (delete a habit)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Habit not found or user is unauthorized.' }); // 404 is not found
        }

        res.status(204).json({ message: 'Deletion successful.' }); // 204 is no content
    } catch (err) {
        res.status(500).json({ error: 'Error deleting habit.' }); // 500 is internal server error
    }
});

// GET /habits (get all habits under user)
router.get('/', authenticate, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.userId });
        res.status(200).json({ habits }); // 200 is OK
    } catch (err) {
        res.status(500).json({ error: 'Error fetching habits.' }); // 500 is internal server error
    }
});

// PATCH /habits/:id (update an existing habit)
router.patch('/:id', authenticate, async (req, res) => {
    const updates = req.body;

    try {
        const updatedHabit = await Habit.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedHabit) {
            return res.status(404).json({ error: 'Habit not found or user is unauthorized' }); // 404 is not found
        }

        res.status(200).json({ habit: updatedHabit }); // 200 is OK
    } catch (err) {
        console.error('Error updating habit:', err);
        res.status(500).json({ error: 'Error updating habit.' }); // 500 is internal server error
    }
});

module.exports = router;