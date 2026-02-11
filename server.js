
/**
 * VISION INSTITUTE BACKEND (Node.js + Express + MongoDB)
 * To run: 
 * 1. npm install express mongoose cors dotenv bcryptjs jsonwebtoken
 * 2. Create a .env file with MONGO_URI and JWT_SECRET
 * 3. node server.js
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/vision_institute');

// Models
const StudentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  course: String,
  teacher: String,
  email: String,
  avatar: String,
  semester: String,
  results: [{
    id: String,
    subject: String,
    score: Number,
    total: Number,
    grade: String,
    status: String,
    remarks: String
  }]
});

const Student = mongoose.model('Student', StudentSchema);

// Routes
app.post('/api/login', async (req, res) => {
  const { id, password } = req.body;
  
  // Admin Login
  if (id === 'admin' && password === 'admin123') {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'secret');
    return res.json({ token, isAdmin: true });
  }

  // Student Login
  const student = await Student.findOne({ id });
  if (!student) return res.status(404).json({ message: 'Ardayga lama helin' });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(400).json({ message: 'Erayga sirta waa khaldan yahay' });

  const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret');
  res.json({ token, isAdmin: false, student });
});

app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newStudent = new Student({ ...req.body, password: hashedPassword });
  await newStudent.save();
  res.json(newStudent);
});

app.put('/api/students/:id', async (req, res) => {
  const updated = await Student.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/students/:id', async (req, res) => {
  await Student.findOneAndDelete({ id: req.params.id });
  res.json({ message: 'Waa la tirtiray' });
});

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
