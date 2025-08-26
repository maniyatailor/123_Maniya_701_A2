const mongoose = require('mongoose');
const Employee = require('./models/Employee');

mongoose.connect('mongodb://localhost:27017/erp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const databases = await adminDb.listDatabases();
    console.log('Available databases:', databases.databases.map(db => db.name));
    
    // Check if erp database exists
    const erpExists = databases.databases.some(db => db.name === 'erp');
    console.log('ERP database exists:', erpExists);
    
    if (erpExists) {
      // List all collections in erp database
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections in erp database:', collections.map(col => col.name));
      
      // Check if employees collection exists
      const employeesCollectionExists = collections.some(col => col.name === 'employees');
      console.log('Employees collection exists:', employeesCollectionExists);
      
      if (employeesCollectionExists) {
        // Count documents in employees collection
        const count = await Employee.countDocuments();
        console.log('Number of employees in database:', count);
        
        // Show all employees
        const employees = await Employee.find();
        console.log('All employees:');
        employees.forEach(emp => {
          console.log(`- ID: ${emp.empid}, Name: ${emp.name}, Email: ${emp.email}, Actual Password: ${emp.actualPassword}`);
        });
      }
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
