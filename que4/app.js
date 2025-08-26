const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'erpsecret', resave: false, saveUninitialized: true }));

mongoose.connect('mongodb://localhost:27017/erp', { useNewUrlParser: true, useUnifiedTopology: true });

function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    req.session.admin = true;
    res.redirect('/employees');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/employees', isAdmin, async (req, res) => {
  const employees = await Employee.find();
  res.render('employees', { employees });
});

app.get('/employees/add', isAdmin, (req, res) => {
  res.render('addEmployee', { error: null, employee: null });
});

app.post('/employees/add', isAdmin, async (req, res) => {
  const { name, email, salary } = req.body;
  if (!name || !email || !salary) {
    return res.render('addEmployee', { error: 'All fields required', employee: null });
  }
  const empid = 'EMP' + Date.now();
  const password = Math.random().toString(36).slice(-8); // Generate random password
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const employee = new Employee({ 
    empid, 
    name, 
    email, 
    salary, 
    password: hashedPassword,
    actualPassword: password  // Store the actual password in database
  });
  await employee.save();

  console.log(`Employee created successfully!`);
  console.log(`Employee ID: ${empid}`);
  console.log(`Password: ${password}`);
  console.log(`Please provide these credentials to the employee.`);

  res.redirect('/employees');
}); 

app.get('/employees/edit/:id', isAdmin, async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.render('addEmployee', { employee, error: null });
});

app.post('/employees/edit/:id', isAdmin, async (req, res) => {
  const { name, email, salary } = req.body;
  await Employee.findByIdAndUpdate(req.params.id, { name, email, salary });
  res.redirect('/employees');
});

app.get('/employees/delete/:id', isAdmin, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect('/employees');
});

app.get('/employees/salary', isAdmin, async (req, res) => {
  const employees = await Employee.find();
  const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
  res.send(`Total Salary: ${totalSalary}`);
});

app.listen(3000, () => console.log('ERP Admin running on 3000'));
