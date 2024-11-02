const express = require('express');
const cors = require('cors');
const connectDB = require('./Database/db');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
});

const Task = mongoose.model('Task', taskSchema);
app.get('/',(req,res)=>{
    res.send("Server is running perfectly");
})

app.get('/getalltasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

app.post('/addtask', async (req, res) => {
    const { task } = req.body;
    const newTask = new Task({ task });
    try {
        await newTask.save();
        res.status(201).json(newTask); 
    } catch (error) {
        res.status(500).json({ message: 'Error adding task' });
    }
});

app.delete('/deletetask/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (deletedTask) {
            res.status(200).json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
