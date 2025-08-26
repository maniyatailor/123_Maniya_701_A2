const mongoose = require('mongoose');
const Employee = require('./models/Employee');

mongoose.connect('mongodb://localhost:27017/erp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const employees = await Employee.find();
    console.log('Employees in database:');
    employees.forEach(emp => {
    console.log(`ID: ${emp.empid}, Name: ${emp.name}, Email: ${emp.email}, Password: ${emp.password}, Actual Password: ${emp.actualPassword || 'N/A'}`);
    });
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
