const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/erp', { useNewUrlParser: true, useUnifiedTopology: true });

const JWT_SECRET = 'secretkey';

function auth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.redirect('/login');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.redirect('/login');
  }
}

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { empid, password } = req.body;
  const employee = await Employee.findOne({ empid });
  if (!employee) return res.render('login', { error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, employee.password);
  if (!match) return res.render('login', { error: 'Invalid credentials' });
  const token = jwt.sign({ empid: employee.empid }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/profile');
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Profile page
app.get('/profile', auth, async (req, res) => {
  const employee = await Employee.findOne({ empid: req.user.empid });
  res.render('profile', { employee });
});

// Leave application page
app.get('/leave', auth, (req, res) => {
  res.render('leave', { error: null });
});

app.post('/leave', auth, async (req, res) => {
  const { date, reason } = req.body;
  if (!date || !reason) return res.render('leave', { error: 'All fields required' });
  await new Leave({ empid: req.user.empid, date, reason }).save();
  res.redirect('/leaves');
});

// List leaves
app.get('/leaves', auth, async (req, res) => {
  const leaves = await Leave.find({ empid: req.user.empid });
  res.render('leaveList', { leaves });
});

app.listen(3003, () => console.log('Employee site running on 3003'));
