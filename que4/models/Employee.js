const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empid: { type: String, unique: true },
  name: String,
  email: String,
  password: String,        // Hashed password for authentication
  actualPassword: String,  // Actual password for display/reference
  salary: Number,
});

module.exports = mongoose.model('Employee', employeeSchema);
