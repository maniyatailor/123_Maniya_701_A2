const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');

mongoose.connect('mongodb://localhost:27017/erp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Get employee ID and password from command line arguments
    const empid = process.argv[2];
    const passwordToTest = process.argv[3];
    
    if (!empid || !passwordToTest) {
      console.log('Usage: node testLogin.js <empid> <password>');
      return mongoose.disconnect();
    }

    const employee = await Employee.findOne({ empid });
    if (!employee) {
      console.log('Employee not found');
      return mongoose.disconnect();
    }

    console.log(`Testing login for: ${employee.name} (${employee.empid})`);
    
    const match = await bcrypt.compare(passwordToTest, employee.password);
    console.log(`Password "${passwordToTest}": ${match ? '✓ MATCH' : '✗ NO MATCH'}`);

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
