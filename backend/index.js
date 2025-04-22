const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const habitsRouter = require('./routes/habits');
const authRouter = require('./routes/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use(cors()); // DEVELOPMENT ONLY, INSECURE
app.use(express.json());
app.use('/habits', habitsRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Habit Tracker is Live!');
    console.log('Habit Tracker is Live!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});