const express = require('express');
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

const app = express();
const PORT = 8000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Registration form route
app.get('/', (req, res) => {
  res.render('register', { errors: {}, old: {}, files: {} });
});

// Handle form submission
app.post('/register',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'otherPics', maxCount: 5 }
  ]),
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    body('email').isEmail().withMessage('Invalid email'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('hobbies').custom((value, { req }) => {
      if (!req.body.hobbies) return false;
      return true;
    }).withMessage('Select at least one hobby'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.files['profilePic']) {
      let errorObj = errors.mapped();
      if (!req.files['profilePic']) errorObj.profilePic = { msg: 'Profile pic is required' };
      return res.render('register', { errors: errorObj, old: req.body, files: req.files });
    }
    // Save data to file for download
    const userData = {
      ...req.body,
      profilePic: req.files['profilePic'][0].filename,
      otherPics: req.files['otherPics'] ? req.files['otherPics'].map(f => f.filename) : []
    };
    fs.writeFileSync(path.join(__dirname, 'public', 'downloads', `${userData.username}.json`), JSON.stringify(userData, null, 2));
    res.render('success', { user: userData });
  }
);

// Download route
app.get('/download/:username', (req, res) => {
  const file = path.join(__dirname, 'public', 'downloads', `${req.params.username}.json`);
  if (fs.existsSync(file)) {
    res.download(file);
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
