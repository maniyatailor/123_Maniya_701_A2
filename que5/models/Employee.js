const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  empid: String,
  name: String,
  email: String,
  password: String,
  actualPassword: String,  // Add actualPassword field
  salary: Number
});
module.exports = mongoose.model('Employee', employeeSchema);
