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
    const { name, priority, description, repeats, date, startBy, completeBy } = req.body;

    try {
        const newHabit = await Habit.create({
            name,
            priority,
            description,
            repeats,
            date,
            startBy,
            completeBy,
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
        const habits = await Habit.find({
            userId: req.userId
        });
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

// GET /habits/day/:date (get all habits under user on <date>)
router.get('/day/:date', authenticate, async (req, res) => {
    try {
        const userDate = new Date(req.params.date);
        const endDate = new Date(userDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);

        if (isNaN(userDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' }); // 400 is bad request
        }

        const dayOfWeek = userDate.toLocaleDateString('en-US', {
            weekday: 'long',
            timeZone: 'UTC'
        }).toLowerCase();

        const habits = await Habit.find({
            userId: req.userId,
            $or: [
                { date: { $gte: userDate, $lt: endDate }, repeats: { $size: 0 } },
                { repeats: dayOfWeek, date: { $lte: userDate } }
            ]
        });

        res.status(200).json({ habits }); // 200 is OK
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching habits.' }); // 500 is internal server error
    }
});

// GET /habits/stats
router.get('/stats', authenticate, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.userId });
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let tasksCreated = 0;
        let tasksCompleted = 0;

        for (const habit of habits) {
            const isRepeating = habit.repeats && habit.repeats.length > 0;

            if (!isRepeating) {
                if (habit.date <= today) {
                    tasksCreated++;
                }
            } else {
                const current = new Date(habit.date);
                current.setUTCHours(0, 0, 0, 0);

                while (current <= today) {
                    const day = current.toLocaleDateString('en-US', {
                        weekday: 'long',
                        timeZone: 'UTC'
                    }).toLowerCase();

                    if (habit.repeats.includes(day)) {
                        tasksCreated++;
                    }
                    current.setUTCDate(current.getUTCDate() + 1);
                }
            }

            if (habit.completedDates && habit.completedDates.length > 0) {
                const completedBeforeDate = habit.completedDates.filter(date => {
                    const d = new Date(date);
                    d.setUTCHours(0, 0, 0, 0);
                    return d <= today;
                }).length;

                tasksCompleted += completedBeforeDate;
            }
        }

        const completionPercentage = tasksCreated > 0
            ? Math.round((tasksCompleted / tasksCreated) * 100)
            : 0;

        res.status(200).json({
            tasksCreated,
            tasksCompleted,
            completionPercentage
            });
    } catch(err) {
        console.error("Could not get stats:", err);
        res.status(500).json({ error: 'Error fetching statistics.' }); // 500 is internal server error
    }
});

module.exports = router;